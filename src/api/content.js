const BASE = import.meta.env.VITE_API_URL || '';
const API_BASE = `${BASE}/content`;

export async function fetchContents() {
  const res = await fetch(`${API_BASE}/list`);
  if (!res.ok) throw new Error('Failed to fetch contents');
  return res.json();
}

export async function importContent(url) {
  const res = await fetch(`${API_BASE}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to import content');
  return data;
}

export async function confirmContent(payload) {
  const res = await fetch(`${API_BASE}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save content');
  return data;
}

export async function updateContent(id, patch) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update content');
  return data;
}
