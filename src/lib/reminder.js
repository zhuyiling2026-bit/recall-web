export function getReminder(item) {
  if (item.status === 'read' || item.status === 'deleted') return null;
  const created = new Date(item.created_at);
  const now = new Date();
  const days = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  if (days >= 30) return { label: 'Clean up', color: 'gray' };
  if (days >= 7) return { label: 'Review', color: 'red' };
  if (days >= 3) return { label: '3d unread', color: 'yellow' };
  return null;
}

export const CATEGORY_MAP = {
  all: null,
  education: 'education',
  business: ['business', 'tech'],
  entertainment: 'entertainment',
  health: ['health', 'other'],
};
