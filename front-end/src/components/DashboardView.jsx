import React from 'react';
import {
  TrendingUp,
  Users,
  CalendarClock,
  Activity,
  PlusCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PlatformBadge, StatusBadge } from './PlatformBadge';
import { QUICK_TEMPLATES } from '../data/sampleData';

export function DashboardView({
  posts,
  accounts,
  onOpenComposer,
  onNavigate,
  onUseTemplate,
}) {
  const { t, locale, formatNumber, formatDate } = useLanguage();

  const activeAccounts = accounts.filter((acc) => acc.active);
  const totalReach = activeAccounts.reduce((acc, item) => acc + (item.reach30d || 0), 0);
  const totalFollowers = activeAccounts.reduce((acc, item) => acc + (item.followers || 0), 0);
  const avgEngagement =
    activeAccounts.length > 0
      ? (
          activeAccounts.reduce((acc, item) => acc + (item.engagementRate || 0), 0) /
          activeAccounts.length
        ).toFixed(1)
      : '0.0';

  const scheduledPosts = posts
    .filter((p) => p.status === 'scheduled')
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

  const pillarCounts = posts.reduce((acc, post) => {
    const key = post.pillar || 'tutorial';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const pillarKeys = ['tutorial', 'behindTheScenes', 'career', 'launch', 'community'];
  const maxReachPlatform = Math.max(...accounts.map((a) => a.reach30d || 1), 1);

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h1 className="view-title">{t('dashboard.welcomeTitle')}</h1>
          <p className="view-subtitle">{t('dashboard.welcomeSubtitle')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenComposer()}>
          <PlusCircle size={18} />
          <span>{t('app.newPost')}</span>
        </button>
      </div>

      {/* KPI Summary Grid */}
      <div className="kpi-grid">
        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.totalReach')}</span>
            <div className="kpi-icon-box accent-indigo">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="kpi-value">{formatNumber(totalReach)}</div>
          <div className="kpi-trend positive">+12.4% {t('dashboard.vsLastMonth')}</div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.avgEngagement')}</span>
            <div className="kpi-icon-box accent-emerald">
              <Activity size={20} />
            </div>
          </div>
          <div className="kpi-value">{avgEngagement}%</div>
          <div className="kpi-trend positive">+0.8% {t('dashboard.vsLastMonth')}</div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.scheduledQueue')}</span>
            <div className="kpi-icon-box accent-amber">
              <CalendarClock size={20} />
            </div>
          </div>
          <div className="kpi-value">{scheduledPosts.length}</div>
          <div className="kpi-trend neutral">
            {posts.filter((p) => p.status === 'draft').length} {t('statuses.draft').toLowerCase()}s
          </div>
        </div>

        <div className="card kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">{t('dashboard.totalFollowers')}</span>
            <div className="kpi-icon-box accent-sky">
              <Users size={20} />
            </div>
          </div>
          <div className="kpi-value">{formatNumber(totalFollowers)}</div>
          <div className="kpi-trend positive">+9.3% {t('dashboard.vsLastMonth')}</div>
        </div>
      </div>

      {/* Two-Column Middle Section */}
      <div className="dashboard-columns">
        {/* Upcoming Publishing Queue */}
        <div className="card section-card">
          <div className="section-header">
            <h2>{t('dashboard.upcomingQueue')}</h2>
            <button className="btn-link" onClick={() => onNavigate('studio')}>
              <span>{t('dashboard.viewAllQueue')}</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {scheduledPosts.length === 0 ? (
            <div className="empty-box">{t('dashboard.noScheduled')}</div>
          ) : (
            <div className="queue-list">
              {scheduledPosts.slice(0, 4).map((post) => (
                <div
                  key={post.id}
                  className="queue-item"
                  onClick={() => onOpenComposer(post)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="queue-item-top">
                    <PlatformBadge platform={post.platform} />
                    <StatusBadge status={post.status} />
                    <span className="queue-date">{formatDate(post.scheduledAt)}</span>
                  </div>
                  <h4 className="queue-title">{post.title}</h4>
                  <p className="queue-excerpt">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Platform Performance & Content Pillars */}
        <div className="dashboard-side-stack">
          <div className="card section-card">
            <div className="section-header">
              <h2>{t('dashboard.platformPerformance')}</h2>
            </div>
            <div className="bar-list">
              {accounts.map((acc) => {
                const widthPct = Math.round(((acc.reach30d || 0) / maxReachPlatform) * 100);
                return (
                  <div key={acc.id} className="bar-row">
                    <div className="bar-row-header">
                      <PlatformBadge platform={acc.platform} />
                      <span className="bar-row-meta">
                        {formatNumber(acc.reach30d)} • {acc.engagementRate}% {t('dashboard.engagement')}
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${widthPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card section-card">
            <div className="section-header">
              <h2>{t('dashboard.pillarDistribution')}</h2>
            </div>
            <div className="pillar-chips-grid">
              {pillarKeys.map((key) => {
                const count = pillarCounts[key] || 0;
                return (
                  <div key={key} className="pillar-stat-item">
                    <div className="pillar-stat-info">
                      <CheckCircle2 size={15} className="text-accent" />
                      <span>{t(`pillars.${key}`)}</span>
                    </div>
                    <span className="pillar-stat-badge">
                      {count} {t('dashboard.postsCount')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Content Prompt Templates */}
      <div className="card section-card">
        <div className="section-header">
          <div className="header-with-icon">
            <Sparkles size={18} className="text-accent" />
            <h2>{t('dashboard.quickTemplates')}</h2>
          </div>
        </div>
        <div className="templates-grid">
          {QUICK_TEMPLATES.map((tpl) => (
            <div key={tpl.id} className="template-card">
              <div className="template-top">
                <PlatformBadge platform={tpl.platform} />
                <span className="pillar-tag">{t(`pillars.${tpl.pillar}`)}</span>
              </div>
              <h4>{tpl.title[locale] || tpl.title['pt-BR']}</h4>
              <p>{tpl.content[locale] || tpl.content['pt-BR']}</p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() =>
                  onUseTemplate({
                    title: tpl.title[locale] || tpl.title['pt-BR'],
                    platform: tpl.platform,
                    pillar: tpl.pillar,
                    status: 'draft',
                    mediaType: 'text',
                    content: tpl.content[locale] || tpl.content['pt-BR'],
                    hashtags: tpl.hashtags,
                  })
                }
              >
                {t('dashboard.useTemplate')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
