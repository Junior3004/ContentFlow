<?php

declare(strict_types=1);

namespace ContentFlow;

use PDO;

class AccountRepository
{
    public function __construct(private PDO $pdo)
    {
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM social_accounts ORDER BY id ASC');
        $rows = $stmt->fetchAll();

        return array_map([$this, 'mapRowToAccount'], $rows);
    }

    public function update(int $id, array $payload): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM social_accounts WHERE id = ?');
        $stmt->execute([$id]);
        $existing = $stmt->fetch();

        if (!$existing) {
            return null;
        }

        $active = isset($payload['active']) ? (int) ((bool) $payload['active']) : (int) $existing['active'];
        $weeklyTarget = isset($payload['weeklyTarget'])
            ? (int) $payload['weeklyTarget']
            : (int) $existing['weekly_target'];

        $updateStmt = $this->pdo->prepare('
            UPDATE social_accounts
            SET active = ?, weekly_target = ?
            WHERE id = ?
        ');
        $updateStmt->execute([$active, $weeklyTarget, $id]);

        $stmt->execute([$id]);
        $updated = $stmt->fetch();

        return $updated ? $this->mapRowToAccount($updated) : null;
    }

    private function mapRowToAccount(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'platform' => (string) $row['platform'],
            'handle' => (string) $row['handle'],
            'displayName' => (string) $row['display_name'],
            'followers' => (int) $row['followers'],
            'growth30d' => (float) $row['growth_30d'],
            'reach30d' => (int) $row['reach_30d'],
            'engagementRate' => (float) $row['engagement_rate'],
            'weeklyTarget' => (int) $row['weekly_target'],
            'active' => (bool) $row['active'],
            'bestTime' => (string) $row['best_time'],
        ];
    }
}
