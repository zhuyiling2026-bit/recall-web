import { getToken, clearToken } from '../lib/supabase';

const BASE = import.meta.env.VITE_API_URL || '';
const API_BASE = `${BASE}/content`;

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });
  if (res.status === 401) {
    clearToken();
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  return res;
}

export async function fetchContents() {
  const res = await apiFetch(`${API_BASE}/list`);
  if (!res.ok) throw new Error('Failed to fetch contents');
  return res.json();
}

export async function importContent(url) {
  const res = await apiFetch(`${API_BASE}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to import content');
  return data;
}

export async function confirmContent(payload) {
  const res = await apiFetch(`${API_BASE}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save content');
  return data;
}

export async function deleteContent(id) {
  const res = await apiFetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete content');
  return res.json();
}

export async function updateContent(id, patch) {
  const res = await apiFetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update content');
  return data;
}

const CAT_API = `${BASE}/categories`;

export async function fetchCategories() {
  const res = await apiFetch(CAT_API);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function saveCategories(cats) {
  const res = await apiFetch(CAT_API, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cats),
  });
  if (!res.ok) throw new Error('Failed to save categories');
  return res.json();
}
