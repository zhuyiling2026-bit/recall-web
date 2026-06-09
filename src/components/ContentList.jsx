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
    if (viewMode === 'trash') {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      return items.filter(
        (i) => i.status === 'deleted' && new Date(i.createdAt) >= threeDaysAgo,
      );
    }

    let result = items.filter((i) => i.status !== 'deleted');

    if (viewMode === 'review') {
      result = result.filter((i) => getReminder(i) !== null);
    }

    if (filterCategory !== 'all') {
      const cats = CATEGORY_MAP[filterCategory];
      result = result.filter((i) => {
        const cat = (i.category || '').toLowerCase();
        if (cats === undefined) return cat === filterCategory;
        return Array.isArray(cats)
          ? cats.some((c) => c.toLowerCase() === cat)
          : cat === cats.toLowerCase();
      });
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
        {viewMode === 'trash' ? (
          <>
            <p className={styles.emptyTitle}>回收站为空</p>
            <p className={styles.emptyHint}>删除的内容会出现在这里，超过 3 天自动清空</p>
          </>
        ) : viewMode === 'review' ? (
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
      {viewMode === 'trash' && (
        <div className={styles.trashBanner}>
          回收站内容将在删除 3 天后自动清空
        </div>
      )}
      <div className={styles.grid}>
        {filtered.map((item, idx) => (
          <ContentCard key={item.id} item={item} index={idx} />
        ))}
      </div>
    </div>
  );
}
