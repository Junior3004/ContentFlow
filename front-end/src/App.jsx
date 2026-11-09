import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Layers,
  Calendar,
  BarChart3,
  Settings,
  Globe,
  Sun,
  Moon,
  PlusCircle,
  Database,
} from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { apiService } from './services/api';
import { DashboardView } from './components/DashboardView';
import { ContentStudioView } from './components/ContentStudioView';
import { PostComposerModal } from './components/PostComposerModal';

export default function App() {
  const { t, locale, toggleLocale } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('contentflow_theme') || 'dark');
  const [posts, setPosts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [apiConnected, setApiConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('contentflow_theme', theme);
  }, [theme]);

  useEffect(() => {
    let mounted = true;
    apiService.loadWorkspaceData().then((data) => {
      if (!mounted) return;
      setPosts(data.posts);
      setAccounts(data.accounts);
      setApiConnected(data.apiConnected);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleDuplicatePost = async (post) => {
    const duplicated = await apiService.savePost({
      ...post,
      id: null,
      title: `${post.title} (Copy)`,
      status: 'draft',
    });
    setPosts((prev) => [duplicated, ...prev]);
  };

  const handlePublishNow = async (post) => {
    const published = await apiService.savePost({
      ...post,
      status: 'published',
      scheduledAt: new Date().toISOString().slice(0, 16),
      metrics: post.metrics?.reach
        ? post.metrics
        : { reach: 1420, likes: 108, comments: 16, shares: 9 },
    });
    setPosts((prev) => prev.map((p) => (p.id === published.id ? published : p)));
  };

  const handleDeletePost = async (postId) => {
    await apiService.deletePost(postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleOpenComposer = (post = null) => {
    setEditingPost(post);
    setComposerOpen(true);
  };

  const handleSavePost = async (postPayload) => {
    const saved = await apiService.savePost(postPayload);
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev];
    });
    setComposerOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-logo">CF</div>
          <div>
            <div className="brand-title">{t('app.name')}</div>
            <div className="brand-subtitle">{t('app.tagline')}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={19} />
            <span>{t('nav.dashboard')}</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'studio' ? 'active' : ''}`}
            onClick={() => setActiveTab('studio')}
          >
            <Layers size={19} />
            <span>{t('nav.studio')}</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <Calendar size={19} />
            <span>{t('nav.calendar')}</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={19} />
            <span>{t('nav.analytics')}</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'accounts' ? 'active' : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            <Settings size={19} />
            <span>{t('nav.accounts')}</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className={`connection-pill ${apiConnected ? 'online' : 'local'}`}>
            <Database size={14} />
            <span>{apiConnected ? t('app.apiConnected') : t('app.localMode')}</span>
          </div>

          <div className="sidebar-controls">
            <button className="control-btn" onClick={toggleLocale} title={t('app.languageLabel')}>
              <Globe size={16} />
              <span>{locale === 'pt-BR' ? 'PT-BR' : 'EN-US'}</span>
            </button>

            <button
              className="control-btn"
              onClick={handleToggleTheme}
              title={theme === 'dark' ? t('app.themeLight') : t('app.themeDark')}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardView
            posts={posts}
            accounts={accounts}
            onOpenComposer={handleOpenComposer}
            onNavigate={setActiveTab}
            onUseTemplate={handleOpenComposer}
          />
        )}

        {activeTab === 'studio' && (
          <ContentStudioView
            posts={posts}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenComposer={handleOpenComposer}
            onDuplicatePost={handleDuplicatePost}
            onPublishNow={handlePublishNow}
            onDeletePost={handleDeletePost}
          />
        )}

        {activeTab !== 'dashboard' && activeTab !== 'studio' && (
          <div className="view-container">
            <div className="card empty-state-card">
              <h2>{t(`nav.${activeTab}`)}</h2>
              <p className="view-subtitle">
                {locale === 'pt-BR'
                  ? 'Este módulo será habilitado nas próximas etapas do desenvolvimento.'
                  : 'This module will be enabled in the upcoming development steps.'}
              </p>
              <button className="btn btn-primary" onClick={() => setActiveTab('dashboard')}>
                <PlusCircle size={17} />
                <span>{t('nav.dashboard')}</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <PostComposerModal
        isOpen={composerOpen}
        initialPost={editingPost}
        onClose={() => {
          setComposerOpen(false);
          setEditingPost(null);
        }}
        onSave={handleSavePost}
      />
    </div>
  );
}
