import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const PLATFORM_META = {
  instagram: { label: 'Instagram', color: '#E1306C', short: 'IG' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2', short: 'IN' },
  x: { label: 'X / Twitter', color: '#1DA1F2', short: 'X' },
  youtube: { label: 'YouTube', color: '#FF0000', short: 'YT' },
  tiktok: { label: 'TikTok', color: '#00F2FE', short: 'TT' },
};

export function PlatformBadge({ platform }) {
  const { t } = useLanguage();
  const meta = PLATFORM_META[platform] || {
    label: platform,
    color: '#6366f1',
    short: 'SM',
  };

  return (
    <span
      className="platform-badge"
      style={{
        '--platform-color': meta.color,
      }}
    >
      <span className="platform-dot" />
      {t(`platforms.${platform}`)}
    </span>
  );
}

export function StatusBadge({ status }) {
  const { t } = useLanguage();
  return (
    <span className={`status-badge status-${status}`}>
      {t(`statuses.${status}`)}
    </span>
  );
}
