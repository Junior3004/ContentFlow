# ContentFlow Roadmap

This document tracks the planned architecture, upcoming features, refactoring goals, and testing milestones for **ContentFlow** — a personal, self-hosted social media content management, scheduling, and analytics workspace.

---

## Phase 1: Core Workspace & Local Foundation (Current Stage)
- [x] Repository setup, MIT license, environment configuration templates (`.env.example`)
- [ ] **Front-end Workspace (React.js + Vite)**
  - [ ] Bilingual internationalization system (`en` and `pt-BR`) with instant switching and local persistence
  - [ ] Responsive sidebar layout with Dark/Light mode support
  - [ ] **Overview Dashboard**: KPI summary cards (Reach, Engagement Rate, Scheduled Queue, Follower Growth), performance charts, and upcoming queue preview
  - [ ] **Content Composer & Post Manager**: Create, edit, duplicate, filter, and delete posts across platforms (Instagram, X/Twitter, LinkedIn, YouTube, TikTok) with live platform character counters and preview cards
  - [ ] **Editorial Calendar View**: Monthly and weekly visual schedule of drafts, scheduled posts, and published items
  - [ ] **Analytics Explorer**: Platform-by-platform performance breakdown and best posting time insights
  - [ ] **Connected Accounts & Workspace Settings**: Manage personal social profile handles, posting goals, and language/timezone preferences
- [ ] **Back-end API (Vanilla PHP 8+ + SQLite)**
  - [ ] Lightweight zero-framework REST router, JSON middleware, and CORS handling
  - [ ] PDO SQLite connection manager with automatic schema migration and sample data seeder
  - [ ] CRUD endpoints for `/api/posts`, `/api/accounts`, `/api/analytics`, and `/api/settings`

---

## Phase 2: Workflow Automation & Rich Media (~12–15 hours planned)
- [ ] **Local Media Library & Asset Upload (~4h)**
  - [ ] Local image/video upload handling in Vanilla PHP (`back-end/storage/uploads`)
  - [ ] Aspect-ratio validation per platform (e.g., 1:1 Square, 4:5 Portrait, 9:16 Reels/Shorts, 16:9 YouTube)
  - [ ] Image metadata stripping and thumbnail generation using PHP GD/Imagick
- [ ] **Thread & Carousel Builder (~4h)**
  - [ ] Multi-slide carousel composer for Instagram/LinkedIn
  - [ ] Connected thread composer for X/Twitter with per-post character limits
- [ ] **Hashtag & Caption Template Vault (~3h)**
  - [ ] Reusable hashtag groups and caption hooks categorized by content pillar
  - [ ] One-click insertion into the post composer
- [ ] **Markdown & Rich Text Formatting Preview (~2h)**
  - [ ] Platform-specific text preview showing line breaks, mentions, and hashtag highlighting

---

## Phase 3: Publishing Queue & Social API Connectors (~15–20 hours planned)
- [ ] **Background CLI Scheduler in PHP (~4h)**
  - [ ] CLI worker script (`php cli/scheduler.php`) to process due `scheduled` posts and transition states with retry logging
  - [ ] Dead-letter queue and failure notification log for posts that fail validation
- [ ] **Personal OAuth 2.0 / API Token Integration (~8h)**
  - [ ] Local encrypted token storage for personal developer keys
  - [ ] Direct publishing adapter interface (`PublisherInterface`) with concrete adapters for X API v2, LinkedIn Share API, and Instagram Graph API
- [ ] **Webhook & Metrics Sync Command (~4h)**
  - [ ] CLI command to pull periodic engagement snapshots (likes, comments, shares, impressions) into `analytics_snapshots`

---

## Phase 4: Quality, Testing & Portability (~8–12 hours planned)
- [ ] **Automated Testing Suite (~5h)**
  - [ ] Front-end unit and component tests with Vitest and React Testing Library
  - [ ] Back-end REST API integration tests using PHPUnit with an in-memory SQLite database (`:memory:`)
- [ ] **Data Portability & Backup Tools (~3h)**
  - [ ] Export editorial calendar and analytics reports to CSV and JSON
  - [ ] One-click SQLite database backup and restore from the Settings screen
- [ ] **Docker & Self-Hosting Packaging (~2h)**
  - [ ] Optional `docker-compose.yml` for one-command local startup
