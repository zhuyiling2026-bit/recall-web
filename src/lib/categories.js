const STORAGE_KEY = 'recall_categories';

const DEFAULTS = [
  { key: 'education', label: 'Learn' },
  { key: 'business', label: 'Career' },
  { key: 'entertainment', label: 'Fun' },
  { key: 'health', label: 'Life' },
  { key: 'travel', label: 'Travel' },
  { key: 'lifestyle', label: 'Lifestyle' },
];

export function loadCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [...DEFAULTS];
}

export function saveCategories(cats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
}

export function resetCategories() {
  localStorage.removeItem(STORAGE_KEY);
  return [...DEFAULTS];
}
