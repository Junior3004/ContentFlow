<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/src/Database.php';
require_once dirname(__DIR__) . '/src/PostRepository.php';
require_once dirname(__DIR__) . '/src/AccountRepository.php';

use ContentFlow\Database;
use ContentFlow\PostRepository;
use ContentFlow\AccountRepository;

// CORS & JSON Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$uriPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$segments = array_values(array_filter(explode('/', trim($uriPath, '/'))));

function sendJson(mixed $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

try {
    $pdo = Database::getConnection();
    $postRepo = new PostRepository($pdo);
    $accountRepo = new AccountRepository($pdo);

    // Route: /api/health
    if (($segments[0] ?? '') === 'api' && ($segments[1] ?? '') === 'health') {
        sendJson([
            'status' => 'ok',
            'service' => 'ContentFlow Vanilla PHP API',
            'driver' => 'sqlite',
            'timestamp' => date(DATE_ATOM),
        ]);
    }

    // Route: /api/posts and /api/posts/{id}
    if (($segments[0] ?? '') === 'api' && ($segments[1] ?? '') === 'posts') {
        $postId = isset($segments[2]) ? (int) $segments[2] : null;

        if ($method === 'GET' && $postId === null) {
            sendJson(['data' => $postRepo->findAll()]);
        }

        if ($method === 'GET' && $postId !== null) {
            $post = $postRepo->findById($postId);
            if ($post === null) {
                sendJson(['error' => 'Post not found'], 404);
            }
            sendJson(['data' => $post]);
        }

        if ($method === 'POST') {
            $created = $postRepo->create(getJsonBody());
            sendJson(['data' => $created], 201);
        }

        if ($method === 'PUT' && $postId !== null) {
            $updated = $postRepo->update($postId, getJsonBody());
            if ($updated === null) {
                sendJson(['error' => 'Post not found'], 404);
            }
            sendJson(['data' => $updated]);
        }

        if ($method === 'DELETE' && $postId !== null) {
            $postRepo->delete($postId);
            sendJson(['deleted' => true]);
        }
    }

    // Route: /api/accounts and /api/accounts/{id}
    if (($segments[0] ?? '') === 'api' && ($segments[1] ?? '') === 'accounts') {
        $accountId = isset($segments[2]) ? (int) $segments[2] : null;

        if ($method === 'GET') {
            sendJson(['data' => $accountRepo->findAll()]);
        }

        if ($method === 'PUT' && $accountId !== null) {
            $updated = $accountRepo->update($accountId, getJsonBody());
            if ($updated === null) {
                sendJson(['error' => 'Account not found'], 404);
            }
            sendJson(['data' => $updated]);
        }
    }

    sendJson([
        'name' => 'ContentFlow REST API',
        'endpoints' => ['/api/health', '/api/posts', '/api/accounts'],
    ], 404);
} catch (Throwable $e) {
    sendJson([
        'error' => 'Internal Server Error',
        'message' => $e->getMessage(),
    ], 500);
}
