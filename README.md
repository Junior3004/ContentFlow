# ContentFlow

**ContentFlow** is a personal, self-hosted social media content management, scheduling, and analytics application. Built for creators and developers who want full control over their personal content pipeline across multiple platforms (Instagram, X/Twitter, LinkedIn, YouTube, and TikTok) without relying on bloated third-party SaaS subscriptions.

It features a modern bilingual interface (**English** and **Brazilian Portuguese**), a reactive **React.js** front-end, and a lightweight, zero-framework **Vanilla PHP 8+** REST API backed by a local **SQLite** database.

---

## Key Features

- **Unified Content Studio & Composer**: Draft, tag, categorize, and schedule posts across multiple social networks with real-time character limits and platform-specific previews.
- **Editorial Content Calendar**: Visualize your weekly and monthly publishing cadence, spot gaps in your schedule, and filter by content pillar or status (`Draft`, `Scheduled`, `Published`).
- **Performance & Analytics Dashboard**: Track reach, engagement rate, impressions, and follower growth across your personal social channels using historical snapshots.
- **Content Pillars & Hashtag Groups**: Organize posts by themes (e.g., *Tutorials*, *Behind the Scenes*, *Product Updates*, *Tips*) to maintain a balanced content mix.
- **Bilingual UI (EN / PT-BR)**: Full internationalization support allowing instant switching between English (`en`) and Brazilian Portuguese (`pt-BR`).
- **Local-First & Privacy-Focused**: Runs entirely on your machine with a zero-configuration **SQLite** database and sample seed data out of the box.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Front-end** | React 18+, Vite, Custom CSS Variables (Dark/Light UI), Lucide Icons |
| **Internationalization** | Custom React i18n Context (`en` / `pt-BR`) with `localStorage` persistence |
| **Back-end** | Vanilla PHP 8.1+ (No frameworks, PSR-inspired clean architecture, REST JSON API) |
| **Database** | SQLite 3 via PHP PDO (with automatic schema migrations & sample data seeding) |

---

## Project Structure

```text
ContentFlow/
├── back-end/                  # Vanilla PHP 8+ REST API
│   ├── public/                # Web server entry point (index.php)
│   ├── src/                   # Controllers, Models, Router, and Database classes
│   └── storage/               # Local SQLite database file (git-ignored) & SQL migrations
├── front-end/                 # React.js (Vite) single-page application
│   ├── public/                # Static assets
│   └── src/                   # Components, Views, i18n dictionaries, API client, and Styles
├── .env.example               # Sample environment configuration (no real secrets)
├── .gitignore                 # Git ignore rules
├── LICENSE                    # MIT License
├── README.md                  # Project documentation
└── ROADMAP.md                 # Planned features and development roadmap
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **PHP** 8.1+ with the `pdo_sqlite` extension enabled

### 1. Clone the repository & configure environment

```bash
git clone https://github.com/Junior3004/ContentFlow.git
cd ContentFlow
cp .env.example .env
```

### 2. Start the Back-end API (Vanilla PHP + SQLite)

The PHP back-end automatically initializes the local SQLite database and seeds it with sample data on its first run:

```bash
cd back-end
php -S localhost:8000 -t public
```

The API will be available at `http://localhost:8000/api`.

### 3. Start the Front-end (React.js + Vite)

In a separate terminal:

```bash
cd front-end
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Data Privacy & Security Notes

- **No Secrets in Repository**: Never commit `.env` files, API tokens, or OAuth secrets. Use `.env.example` as a template.
- **Sample Data Only**: All pre-populated social accounts, posts, and analytics metrics included in the seed scripts are fictional sample data for development and demonstration purposes.

---

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for the detailed development plan, upcoming features, and planned engineering tasks.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.
