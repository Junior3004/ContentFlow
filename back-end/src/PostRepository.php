<?php

declare(strict_types=1);

namespace ContentFlow;

use PDO;

class PostRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM posts ORDER BY scheduled_at DESC, id DESC');
        $rows = $stmt->fetchAll();

        return array_map([$this, 'mapRowToPost'], $rows);
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM posts WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();

        return $row ? $this->mapRowToPost($row) : null;
    }

    public function create(array $payload): array
    {
        $status = (string) ($payload['status'] ?? 'draft');
        $metrics = $payload['metrics'] ?? [];
        $reach = (int) ($metrics['reach'] ?? ($status === 'published' ? 1250 : 0));
        $likes = (int) ($metrics['likes'] ?? ($status === 'published' ? 94 : 0));
        $comments = (int) ($metrics['comments'] ?? ($status === 'published' ? 12 : 0));
        $shares = (int) ($metrics['shares'] ?? ($status === 'published' ? 8 : 0));

        $stmt = $this->pdo->prepare('
            INSERT INTO posts (
                title, platform, pillar, status, media_type, scheduled_at,
                content, hashtags, reach, likes, comments, shares
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');

        $stmt->execute([
            trim((string) ($payload['title'] ?? 'Untitled Post')),
            (string) ($payload['platform'] ?? 'linkedin'),
            (string) ($payload['pillar'] ?? 'tutorial'),
            $status,
            (string) ($payload['mediaType'] ?? 'text'),
            (string) ($payload['scheduledAt'] ?? date('Y-m-d\TH:i')),
            (string) ($payload['content'] ?? ''),
            (string) ($payload['hashtags'] ?? ''),
            $reach,
            $likes,
            $comments,
            $shares,
        ]);

        $id = (int) $this->pdo->lastInsertId();
        return $this->findById($id) ?? [];
    }

    public function update(int $id, array $payload): ?array
    {
        $existing = $this->findById($id);
        if ($existing === null) {
            return null;
        }

        $metrics = $payload['metrics'] ?? $existing['metrics'];

        $stmt = $this->pdo->prepare('
            UPDATE posts
            SET title = ?,
                platform = ?,
                pillar = ?,
                status = ?,
                media_type = ?,
                scheduled_at = ?,
                content = ?,
                hashtags = ?,
                reach = ?,
                likes = ?,
                comments = ?,
                shares = ?
            WHERE id = ?
        ');

        $stmt->execute([
            trim((string) ($payload['title'] ?? $existing['title'])),
            (string) ($payload['platform'] ?? $existing['platform']),
            (string) ($payload['pillar'] ?? $existing['pillar']),
            (string) ($payload['status'] ?? $existing['status']),
            (string) ($payload['mediaType'] ?? $existing['mediaType']),
            (string) ($payload['scheduledAt'] ?? $existing['scheduledAt']),
            (string) ($payload['content'] ?? $existing['content']),
            (string) ($payload['hashtags'] ?? $existing['hashtags']),
            (int) ($metrics['reach'] ?? 0),
            (int) ($metrics['likes'] ?? 0),
            (int) ($metrics['comments'] ?? 0),
            (int) ($metrics['shares'] ?? 0),
            $id,
        ]);

        return $this->findById($id);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM posts WHERE id = ?');
        return $stmt->execute([$id]);
    }

    private function mapRowToPost(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'title' => (string) $row['title'],
            'platform' => (string) $row['platform'],
            'pillar' => (string) $row['pillar'],
            'status' => (string) $row['status'],
            'mediaType' => (string) $row['media_type'],
            'scheduledAt' => (string) $row['scheduled_at'],
            'content' => (string) $row['content'],
            'hashtags' => (string) $row['hashtags'],
            'metrics' => [
                'reach' => (int) $row['reach'],
                'likes' => (int) $row['likes'],
                'comments' => (int) $row['comments'],
                'shares' => (int) $row['shares'],
            ],
        ];
    }
}
