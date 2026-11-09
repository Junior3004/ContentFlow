<?php

declare(strict_types=1);

namespace ContentFlow;

use PDO;

/**
 * Manages the local SQLite database connection, automatic schema migrations,
 * and initial sample data seeding for ContentFlow.
 */
class Database
{
    private static ?PDO $instance = null;

    public static function getConnection(): PDO
    {
        if (self::$instance !== null) {
            return self::$instance;
        }

        $dbDir = dirname(__DIR__) . '/storage/database';
        if (!is_dir($dbDir)) {
            mkdir($dbDir, 0775, true);
        }

        $dbPath = $dbDir . '/contentflow.sqlite';
        $isNewDatabase = !file_exists($dbPath);

        $pdo = new PDO('sqlite:' . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        self::migrate($pdo);

        if ($isNewDatabase || self::isEmpty($pdo)) {
            self::seedSampleData($pdo);
        }

        self::$instance = $pdo;
        return self::$instance;
    }

    private static function migrate(PDO $pdo): void
    {
        $pdo->exec('
            CREATE TABLE IF NOT EXISTS social_accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                platform TEXT NOT NULL,
                handle TEXT NOT NULL,
                display_name TEXT NOT NULL,
                followers INTEGER NOT NULL DEFAULT 0,
                growth_30d REAL NOT NULL DEFAULT 0,
                reach_30d INTEGER NOT NULL DEFAULT 0,
                engagement_rate REAL NOT NULL DEFAULT 0,
                weekly_target INTEGER NOT NULL DEFAULT 3,
                active INTEGER NOT NULL DEFAULT 1,
                best_time TEXT NOT NULL DEFAULT ""
            );
        ');

        $pdo->exec('
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                platform TEXT NOT NULL,
                pillar TEXT NOT NULL DEFAULT "tutorial",
                status TEXT NOT NULL DEFAULT "draft",
                media_type TEXT NOT NULL DEFAULT "text",
                scheduled_at TEXT NOT NULL,
                content TEXT NOT NULL,
                hashtags TEXT NOT NULL DEFAULT "",
                reach INTEGER NOT NULL DEFAULT 0,
                likes INTEGER NOT NULL DEFAULT 0,
                comments INTEGER NOT NULL DEFAULT 0,
                shares INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        ');
    }

    private static function isEmpty(PDO $pdo): bool
    {
        $count = (int) $pdo->query('SELECT COUNT(*) FROM social_accounts')->fetchColumn();
        return $count === 0;
    }

    private static function seedSampleData(PDO $pdo): void
    {
        $accounts = [
            ['instagram', '@junior.codes', 'Junior Oliveira • Dev & Design', 4820, 8.4, 28400, 5.8, 4, 1, '18:30 • Ter / Qui'],
            ['linkedin', 'in/junior-oliveira-dev', 'Junior Oliveira', 3190, 11.2, 34900, 6.4, 3, 1, '09:00 • Ter / Qua / Qui'],
            ['x', '@junior_devflow', 'Junior (ContentFlow)', 1940, 6.1, 19200, 4.3, 5, 1, '12:15 • Seg a Sex'],
            ['youtube', '@JuniorCodeStudio', 'Junior Code Studio', 2650, 9.7, 41800, 7.1, 1, 1, '19:00 • Quarta / Sábado'],
            ['tiktok', '@junior.devclips', 'Junior Dev Clips', 1580, 14.5, 22600, 6.9, 2, 1, '20:00 • Ter / Sex'],
        ];

        $accStmt = $pdo->prepare('
            INSERT INTO social_accounts (
                platform, handle, display_name, followers, growth_30d,
                reach_30d, engagement_rate, weekly_target, active, best_time
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');

        foreach ($accounts as $acc) {
            $accStmt->execute($acc);
        }

        $posts = [
            [
                'Arquitetura do ContentFlow: React + PHP Puro + SQLite',
                'linkedin',
                'behindTheScenes',
                'published',
                'carousel',
                '2026-11-05T09:00:00',
                "Comecei a desenvolver o ContentFlow para centralizar toda a gestão das minhas redes sociais em uma aplicação local, rápida e sem mensalidades.\n\nEscolhi React.js no front-end pela fluidez da interface e PHP 8 puro com SQLite no back-end para manter zero dependências pesadas e fácil execução.",
                '#buildinpublic #reactjs #php #sqlite #softwareengineering',
                6420, 318, 47, 29,
            ],
            [
                '5 motivos para usar SQLite em ferramentas pessoais',
                'instagram',
                'tutorial',
                'published',
                'carousel',
                '2026-11-07T18:30:00',
                "Muitas vezes subestimamos o SQLite, mas ele é perfeito para ferramentas pessoais e aplicações local-first:\n\n1. Arquivo único fácil de fazer backup\n2. Zero servidor de banco separado\n3. Extremamente rápido em leituras locais\n4. Suporte nativo via PDO no PHP\n5. Ideal para evoluir projetos reais.",
                '#sqlite #php #webdev #programacao #desenvolvedor',
                5190, 412, 38, 64,
            ],
            [
                'Thread: Como estruturei o i18n (PT-BR / EN) sem bibliotecas pesadas',
                'x',
                'tutorial',
                'scheduled',
                'text',
                '2026-11-11T12:15:00',
                'Implementar suporte multi-idioma (PT-BR e Inglês) no React não precisa de dezenas de pacotes externos. Com um Context enxuto + Intl.DateTimeFormat e persistência em localStorage, a troca de idioma fica instantânea!',
                '#reactjs #javascript #i18n #frontend #webdev',
                0, 0, 0, 0,
            ],
            [
                'Tour completo pelo Dashboard e Calendário do ContentFlow',
                'youtube',
                'launch',
                'scheduled',
                'video',
                '2026-11-14T19:00:00',
                'Neste vídeo mostro na prática como funciona o ContentFlow por dentro: criação de posts com contador de caracteres por rede social e API REST em PHP puro conectada ao SQLite.',
                '#contentflow #react #php #fullstack #sideproject',
                0, 0, 0, 0,
            ],
        ];

        $postStmt = $pdo->prepare('
            INSERT INTO posts (
                title, platform, pillar, status, media_type, scheduled_at,
                content, hashtags, reach, likes, comments, shares
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');

        foreach ($posts as $post) {
            $postStmt->execute($post);
        }
    }
}
