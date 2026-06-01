import { useContentStore } from '../store/useContentStore';
import styles from './CategoryFilter.module.css';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'education', label: 'Learn' },
  { key: 'business', label: 'Career' },
  { key: 'entertainment', label: 'Fun' },
  { key: 'health', label: 'Life' },
];

export default function CategoryFilter() {
  const filterCategory = useContentStore((s) => s.filterCategory);
  const viewMode = useContentStore((s) => s.viewMode);
  const setFilter = useContentStore((s) => s.setFilter);
  const setViewMode = useContentStore((s) => s.setViewMode);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`${styles.tab} ${filterCategory === c.key ? styles.active : ''}`}
            onClick={() => setFilter(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className={styles.views}>
        <button
          className={`${styles.viewBtn} ${viewMode === 'inbox' ? styles.viewActive : ''}`}
          onClick={() => setViewMode('inbox')}
        >
          Inbox
        </button>
        <button
          className={`${styles.viewBtn} ${viewMode === 'review' ? styles.viewActive : ''}`}
          onClick={() => setViewMode('review')}
        >
          To Review
        </button>
      </div>
    </div>
  );
}
