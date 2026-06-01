import { BookOpen, Trash2 } from 'lucide-react';
import styles from './StatusBadge.module.css';

const STATUS_MAP = {
  read: { label: 'Read', icon: BookOpen, className: 'read' },
  deleted: { label: 'Deleted', icon: Trash2, className: 'deleted' },
};

export default function StatusBadge({ status }) {
  // null/undefined status = active/default, no badge
  if (!status) return null;

  const config = STATUS_MAP[status];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <span className={`${styles.badge} ${styles[config.className]}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}
