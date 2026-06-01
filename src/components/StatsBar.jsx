import { useContentStore } from '../store/useContentStore';
import { getReminder } from '../lib/reminder';
import styles from './StatsBar.module.css';

export default function StatsBar() {
  const items = useContentStore((s) => s.items);

  const unread = items.filter((i) => !i.status || i.status !== 'read').length;
  const read = items.filter((i) => i.status === 'read').length;
  const review = items.filter((i) => getReminder(i) !== null).length;
  const total = items.length;

  const stats = [
    { label: 'Unread', value: unread },
    { label: 'Read', value: read },
    { label: 'To Review', value: review },
    { label: 'Total', value: total },
  ];

  return (
    <div className={styles.bar}>
      {stats.map((s) => (
        <div key={s.label} className={styles.stat}>
          <span className={styles.value}>{s.value}</span>
          <span className={styles.label}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
