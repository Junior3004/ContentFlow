import { INITIAL_ACCOUNTS, INITIAL_POSTS } from '../data/sampleData';

const POSTS_STORAGE_KEY = 'contentflow_posts_v1';
const ACCOUNTS_STORAGE_KEY = 'contentflow_accounts_v1';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

function getLocalPosts() {
  try {
    const raw = localStorage.getItem(POSTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse local posts:', err);
  }
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
  return INITIAL_POSTS;
}

function saveLocalPosts(posts) {
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
}

function getLocalAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse local accounts:', err);
  }
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(INITIAL_ACCOUNTS));
  return INITIAL_ACCOUNTS;
}

function saveLocalAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

export const apiService = {
  async loadWorkspaceData() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1800);

      const [postsRes, accountsRes] = await Promise.all([
        fetch(`${API_BASE}/posts`, { signal: controller.signal }),
        fetch(`${API_BASE}/accounts`, { signal: controller.signal }),
      ]);
      clearTimeout(timeout);

      if (postsRes.ok && accountsRes.ok) {
        const postsData = await postsRes.json();
        const accountsData = await accountsRes.json();
        const posts = postsData.data || postsData;
        const accounts = accountsData.data || accountsData;
        saveLocalPosts(posts);
        saveLocalAccounts(accounts);
        return { posts, accounts, apiConnected: true };
      }
    } catch {
      // Fallback to local storage sample data when PHP server is not running
    }

    return {
      posts: getLocalPosts(),
      accounts: getLocalAccounts(),
      apiConnected: false,
    };
  },

  async savePost(postPayload) {
    const isEditing = Boolean(postPayload.id);
    try {
      const url = isEditing ? `${API_BASE}/posts/${postPayload.id}` : `${API_BASE}/posts`;
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload),
      });
      if (response.ok) {
        const result = await response.json();
        const saved = result.data || result;
        const current = getLocalPosts();
        const next = isEditing
          ? current.map((p) => (p.id === saved.id ? saved : p))
          : [saved, ...current];
        saveLocalPosts(next);
        return saved;
      }
    } catch {
      // Fallback to local persistence
    }

    const current = getLocalPosts();
    if (isEditing) {
      const updated = {
        ...postPayload,
        metrics: postPayload.metrics || { reach: 0, likes: 0, comments: 0, shares: 0 },
      };
      const next = current.map((p) => (p.id === updated.id ? updated : p));
      saveLocalPosts(next);
      return updated;
    }

    const created = {
      ...postPayload,
      id: Date.now(),
      metrics:
        postPayload.status === 'published'
          ? { reach: 1250, likes: 94, comments: 12, shares: 8 }
          : { reach: 0, likes: 0, comments: 0, shares: 0 },
    };
    const next = [created, ...current];
    saveLocalPosts(next);
    return created;
  },

  async deletePost(postId) {
    try {
      await fetch(`${API_BASE}/posts/${postId}`, { method: 'DELETE' });
    } catch {
      // Fallback to local delete
    }
    const next = getLocalPosts().filter((p) => p.id !== postId);
    saveLocalPosts(next);
    return true;
  },

  async toggleAccountStatus(accountId) {
    const current = getLocalAccounts();
    const updatedList = current.map((acc) =>
      acc.id === accountId ? { ...acc, active: !acc.active } : acc
    );
    saveLocalAccounts(updatedList);

    try {
      const target = updatedList.find((acc) => acc.id === accountId);
      await fetch(`${API_BASE}/accounts/${accountId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target),
      });
    } catch {
      // Ignore network error in local mode
    }

    return updatedList;
  },

  resetSampleData() {
    saveLocalPosts(INITIAL_POSTS);
    saveLocalAccounts(INITIAL_ACCOUNTS);
    return {
      posts: INITIAL_POSTS,
      accounts: INITIAL_ACCOUNTS,
    };
  },
};
