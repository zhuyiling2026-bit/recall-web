import { useEffect, useMemo } from 'react';
import { useContentStore } from '../store/useContentStore';
import { getReminder, CATEGORY_MAP } from '../lib/reminder';
import ContentCard from './ContentCard';
import styles from './ContentList.module.css';

export default function ContentList() {
  const { items, loading, load, filterCategory, viewMode, searchQuery } = useContentStore();

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let result = items.filter((i) => i.status !== 'deleted');

    if (viewMode === 'review') {
      result = result.filter((i) => getReminder(i) !== null);
    }

    if (filterCategory !== 'all') {
      const cats = CATEGORY_MAP[filterCategory];
      result = result.filter((i) =>
        Array.isArray(cats) ? cats.includes(i.category) : i.category === cats
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((i) =>
        i.title?.toLowerCase().includes(q) ||
        i.summary?.toLowerCase().includes(q) ||
        (Array.isArray(i.tags) && i.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    return result;
  }, [items, filterCategory, viewMode, searchQuery]);

  if (loading) {
    return (
      <div className={styles.shell}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={styles.skeleton}>
            <div className={styles.skelTitle} />
            <div className={styles.skelLine} />
            <div className={styles.skelLineShort} />
          </div>
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className={styles.empty}>
        {viewMode === 'review' ? (
          <>
            <p className={styles.emptyTitle}>Nothing to review</p>
            <p className={styles.emptyHint}>Come back later — new and unread items will show up here</p>
          </>
        ) : filterCategory !== 'all' ? (
          <>
            <p className={styles.emptyTitle}>No content in this category</p>
            <p className={styles.emptyHint}>Try importing something or switch to another filter</p>
          </>
        ) : (
          <>
            <p className={styles.emptyTitle}>Your collection is empty</p>
            <p className={styles.emptyHint}>Paste a URL above and start building your library</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.grid}>
        {filtered.map((item, idx) => (
          <ContentCard key={item.id} item={item} index={idx} />
        ))}
      </div>
    </div>
  );
}
