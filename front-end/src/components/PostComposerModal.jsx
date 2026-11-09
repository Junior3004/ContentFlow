import React, { useState, useEffect } from 'react';
import { X, Hash, AlertTriangle, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PLATFORM_LIMITS, HASHTAG_PRESETS } from '../data/sampleData';
import { PlatformBadge, StatusBadge } from './PlatformBadge';

function getDefaultDateTime() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(12, 0, 0, 0);
  return d.toISOString().slice(0, 16);
}

export function PostComposerModal({ isOpen, initialPost, onClose, onSave }) {
  const { t, locale, formatDate } = useLanguage();

  const [formData, setFormData] = useState({
    id: null,
    title: '',
    platform: 'linkedin',
    pillar: 'tutorial',
    status: 'scheduled',
    mediaType: 'text',
    scheduledAt: getDefaultDateTime(),
    content: '',
    hashtags: '',
  });

  useEffect(() => {
    if (initialPost) {
      setFormData({
        id: initialPost.id || null,
        title: initialPost.title || '',
        platform: initialPost.platform || 'linkedin',
        pillar: initialPost.pillar || 'tutorial',
        status: initialPost.status || 'scheduled',
        mediaType: initialPost.mediaType || 'text',
        scheduledAt: (initialPost.scheduledAt || getDefaultDateTime()).slice(0, 16),
        content: initialPost.content || '',
        hashtags: initialPost.hashtags || '',
        metrics: initialPost.metrics,
      });
    } else {
      setFormData({
        id: null,
        title: '',
        platform: 'linkedin',
        pillar: 'tutorial',
        status: 'scheduled',
        mediaType: 'text',
        scheduledAt: getDefaultDateTime(),
        content: '',
        hashtags: '',
      });
    }
  }, [initialPost, isOpen]);

  if (!isOpen) return null;

  const charLimit = PLATFORM_LIMITS[formData.platform] || 2200;
  const currentLength = (formData.content || '').length;
  const isOverLimit = currentLength > charLimit;

  const handleInsertHashtags = (tagsString) => {
    setFormData((prev) => {
      const existing = prev.hashtags ? `${prev.hashtags.trim()} ` : '';
      return { ...prev, hashtags: `${existing}${tagsString}`.trim() };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    onSave(formData);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{formData.id ? t('composer.editTitle') : t('composer.createTitle')}</h2>
          <button className="btn-icon" onClick={onClose} aria-label={t('composer.cancel')}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="composer-grid">
          <div className="composer-form-col">
            <div className="form-group">
              <label>{t('composer.titleLabel')}</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder={t('composer.titlePlaceholder')}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label>{t('composer.platformLabel')}</label>
                <select
                  className="form-select"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                >
                  <option value="instagram">{t('platforms.instagram')}</option>
                  <option value="linkedin">{t('platforms.linkedin')}</option>
                  <option value="x">{t('platforms.x')}</option>
                  <option value="youtube">{t('platforms.youtube')}</option>
                  <option value="tiktok">{t('platforms.tiktok')}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('composer.pillarLabel')}</label>
                <select
                  className="form-select"
                  value={formData.pillar}
                  onChange={(e) => setFormData({ ...formData, pillar: e.target.value })}
                >
                  <option value="tutorial">{t('pillars.tutorial')}</option>
                  <option value="behindTheScenes">{t('pillars.behindTheScenes')}</option>
                  <option value="career">{t('pillars.career')}</option>
                  <option value="launch">{t('pillars.launch')}</option>
                  <option value="community">{t('pillars.community')}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('composer.mediaTypeLabel')}</label>
                <select
                  className="form-select"
                  value={formData.mediaType}
                  onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                >
                  <option value="text">{t('composer.mediaTypes.text')}</option>
                  <option value="image">{t('composer.mediaTypes.image')}</option>
                  <option value="carousel">{t('composer.mediaTypes.carousel')}</option>
                  <option value="video">{t('composer.mediaTypes.video')}</option>
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>{t('composer.statusLabel')}</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="draft">{t('statuses.draft')}</option>
                  <option value="scheduled">{t('statuses.scheduled')}</option>
                  <option value="published">{t('statuses.published')}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('composer.scheduleLabel')}</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-with-counter">
                <label>{t('composer.contentLabel')}</label>
                <span className={`char-badge ${isOverLimit ? 'over-limit' : ''}`}>
                  {currentLength} / {charLimit}
                </span>
              </div>
              <textarea
                rows={6}
                required
                className="form-textarea"
                placeholder={t('composer.contentPlaceholder')}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
              {isOverLimit && (
                <div className="char-warning">
                  <AlertTriangle size={14} />
                  <span>{t('composer.charLimitWarning')}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>{t('composer.hashtagsLabel')}</label>
              <input
                type="text"
                className="form-input"
                placeholder={t('composer.hashtagsPlaceholder')}
                value={formData.hashtags}
                onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
              />
              <div className="hashtag-presets">
                <span className="preset-label">{t('composer.hashtagPresetsTitle')}</span>
                {HASHTAG_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className="preset-chip"
                    onClick={() => handleInsertHashtags(preset.tags)}
                  >
                    <Hash size={12} />
                    <span>{preset.label[locale] || preset.label['pt-BR']}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                {t('composer.cancel')}
              </button>
              <button type="submit" className="btn btn-primary">
                <Check size={17} />
                <span>{t('composer.savePost')}</span>
              </button>
            </div>
          </div>

          <div className="composer-preview-col">
            <h3 className="preview-heading">{t('composer.previewTitle')}</h3>
            <div className="social-preview-card">
              <div className="social-preview-header">
                <div className="preview-avatar">JO</div>
                <div className="preview-author">
                  <strong>Junior Oliveira</strong>
                  <span>{formatDate(formData.scheduledAt)}</span>
                </div>
                <div className="preview-badges">
                  <PlatformBadge platform={formData.platform} />
                </div>
              </div>

              <div className="social-preview-body">
                {formData.title && <h4 className="preview-post-title">{formData.title}</h4>}
                <p className="preview-post-text">
                  {formData.content || t('composer.contentPlaceholder')}
                </p>
                {formData.hashtags && <p className="preview-post-tags">{formData.hashtags}</p>}
              </div>

              <div className="social-preview-footer">
                <StatusBadge status={formData.status} />
                <span className="pillar-tag">{t(`pillars.${formData.pillar}`)}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
