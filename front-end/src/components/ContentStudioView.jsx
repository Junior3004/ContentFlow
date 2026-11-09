import React, { useState } from 'react';
import {
  PlusCircle,
  Search,
  Edit3,
  Copy,
  Send,
  Trash2,
  Eye,
  Heart,
  MessageSquare,
  Share2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PlatformBadge, StatusBadge } from './PlatformBadge';
import { PLATFORM_LIMITS } from '../data/sampleData';

export function ContentStudioView({
  posts,
  searchQuery,
  onSearchChange,
  onOpenComposer,
  onDuplicatePost,
  onPublishNow,
  onDeletePost,
}) {
  const { t, formatNumber, formatDate } = useLanguage();
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pillarFilter, setPillarFilter] = useState('all');

  const filteredPosts = posts.filter((post) => {
    if (platformFilter !== 'all' && post.platform !== platformFilter) return false;
    if (statusFilter !== 'all' && post.status !== statusFilter) return false;
    if (pillarFilter !== 'all' && post.pillar !== pillarFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const inTitle = (post.title || '').toLowerCase().includes(q);
      const inContent = (post.content || '').toLowerCase().includes(q);
      const inTags = (post.hashtags || '').toLowerCase().includes(q);
      if (!inTitle && !inContent && !inTags) return false;
    }
    return true;
  });

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h1 className="view-title">{t('studio.title')}</h1>
          <p className="view-subtitle">{t('studio.subtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenComposer()}>
          <PlusCircle size={18} />
          <span>{t('app.newPost')}</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="card filters-bar">
        <div className="search-input-wrapper">
          <Search size={17} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('app.searchPlaceholder')}
            className="form-input search-input"
          />
        </div>

        <div className="filters-group">
          <select
            className="form-select"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            aria-label={t('studio.filterPlatform')}
          >
            <option value="all">{t('platforms.all')}</option>
            <option value="instagram">{t('platforms.instagram')}</option>
            <option value="linkedin">{t('platforms.linkedin')}</option>
            <option value="x">{t('platforms.x')}</option>
            <option value="youtube">{t('platforms.youtube')}</option>
            <option value="tiktok">{t('platforms.tiktok')}</option>
          </select>

          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label={t('studio.filterStatus')}
          >
            <option value="all">{t('statuses.all')}</option>
            <option value="draft">{t('statuses.draft')}</option>
            <option value="scheduled">{t('statuses.scheduled')}</option>
            <option value="published">{t('statuses.published')}</option>
          </select>

          <select
            className="form-select"
            value={pillarFilter}
            onChange={(e) => setPillarFilter(e.target.value)}
            aria-label={t('studio.filterPillar')}
          >
            <option value="all">{t('pillars.all')}</option>
            <option value="tutorial">{t('pillars.tutorial')}</option>
            <option value="behindTheScenes">{t('pillars.behindTheScenes')}</option>
            <option value="career">{t('pillars.career')}</option>
            <option value="launch">{t('pillars.launch')}</option>
            <option value="community">{t('pillars.community')}</option>
          </select>
        </div>
      </div>

      <div className="results-counter">
        {t('studio.showingCount', { count: filteredPosts.length })}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="card empty-state-card">
          <p>{t('studio.emptyState')}</p>
        </div>
      ) : (
        <div className="studio-cards-grid">
          {filteredPosts.map((post) => {
            const limit = PLATFORM_LIMITS[post.platform] || 2200;
            const charLen = (post.content || '').length;
            return (
              <div key={post.id} className="card studio-post-card">
                <div className="studio-post-header">
                  <div className="studio-badges">
                    <PlatformBadge platform={post.platform} />
                    <StatusBadge status={post.status} />
                    <span className="pillar-tag">{t(`pillars.${post.pillar || 'tutorial'}`)}</span>
                  </div>
                  <span className="post-date-label">
                    {post.status === 'published'
                      ? `${t('studio.publishedAt')}: ${formatDate(post.scheduledAt)}`
                      : `${t('studio.scheduledFor')}: ${formatDate(post.scheduledAt)}`}
                  </span>
                </div>

                <h3 className="studio-post-title">{post.title}</h3>
                <p className="studio-post-content">{post.content}</p>

                {post.hashtags && <div className="studio-post-hashtags">{post.hashtags}</div>}

                <div className="studio-post-footer">
                  <div className="studio-metrics">
                    {post.status === 'published' && post.metrics ? (
                      <>
                        <span title={t('studio.metricsReach')}>
                          <Eye size={14} /> {formatNumber(post.metrics.reach)}
                        </span>
                        <span title={t('studio.metricsLikes')}>
                          <Heart size={14} /> {formatNumber(post.metrics.likes)}
                        </span>
                        <span title={t('studio.metricsComments')}>
                          <MessageSquare size={14} /> {formatNumber(post.metrics.comments)}
                        </span>
                        <span title={t('studio.metricsShares')}>
                          <Share2 size={14} /> {formatNumber(post.metrics.shares)}
                        </span>
                      </>
                    ) : (
                      <span className="char-counter-meta">
                        {charLen} / {limit} {t('studio.charCount')}
                      </span>
                    )}
                  </div>

                  <div className="studio-actions">
                    <button
                      className="btn-icon"
                      title={t('studio.edit')}
                      onClick={() => onOpenComposer(post)}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="btn-icon"
                      title={t('studio.duplicate')}
                      onClick={() => onDuplicatePost(post)}
                    >
                      <Copy size={16} />
                    </button>
                    {post.status !== 'published' && (
                      <button
                        className="btn-icon accent"
                        title={t('studio.publishNow')}
                        onClick={() => onPublishNow(post)}
                      >
                        <Send size={16} />
                      </button>
                    )}
                    <button
                      className="btn-icon danger"
                      title={t('studio.delete')}
                      onClick={() => onDeletePost(post.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
