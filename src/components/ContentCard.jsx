import { useState, useEffect, useRef } from 'react';
import { BookOpen, Trash2, ExternalLink, Undo2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ReminderTag from './ReminderTag';
import { useContentStore } from '../store/useContentStore';
import { getReminder } from '../lib/reminder';
import styles from './ContentCard.module.css';

export default function ContentCard({ item, index }) {
  const update = useContentStore((s) => s.update);
  const remove = useContentStore((s) => s.remove);
  const viewMode = useContentStore((s) => s.viewMode);
  const [deleting, setDeleting] = useState(false);
  const timerRef = useRef(null);
  const isDeleted = item.status === 'deleted';

  const handleDelete = () => {
    setDeleting(true);
    timerRef.current = setTimeout(() => {
      update(item.id, { status: 'deleted' });
      setDeleting(false);
    }, 2000);
  };

  const handleUndo = () => {
    clearTimeout(timerRef.current);
    setDeleting(false);
  };

  const handleRestore = () => {
    update(item.id, { status: 'new' });
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const reminder = getReminder(item);
  const num = String(index + 1).padStart(2, '0');

  return (
    <article className={`${styles.card} ${isDeleted ? styles.deleted : ''} ${deleting ? styles.deleting : ''}`}>
      <span className={styles.num}>{num}</span>

      <div className={styles.body}>
        <div className={styles.header}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.badges}>
            {!isDeleted && reminder && <ReminderTag {...reminder} />}
            <StatusBadge status={item.status} />
          </div>
        </div>

        <p className={styles.summary}>{item.summary}</p>

        <div className={styles.meta}>
          <span className={styles.category}>{item.category}</span>
          {item.tags?.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        {isDeleted ? (
          <>
            <button
              className={styles.actionBtn}
              onClick={handleRestore}
              title="恢复"
            >
              <Undo2 size={16} />
            </button>
            <button
              className={`${styles.actionBtn} ${styles.deleteBtn}`}
              onClick={() => remove(item.id)}
              title="永久删除"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : (
          <>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionLink}
              title="Open original"
            >
              <ExternalLink size={16} />
            </a>

            {!deleting && (
              <button
                className={styles.actionBtn}
                onClick={() => update(item.id, { status: 'read' })}
                title="Mark as read"
              >
                <BookOpen size={16} />
              </button>
            )}
            {deleting ? (
              <button className={`${styles.actionBtn} ${styles.undoBtn}`} onClick={handleUndo} title="Undo delete">
                <Undo2 size={16} />
              </button>
            ) : (
              <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={handleDelete} title="Delete">
                <Trash2 size={16} />
              </button>
            )}
          </>
        )}
      </div>

      {deleting && (
        <div className={styles.confirmBar}>
          Delete in 2s — click undo to cancel
        </div>
      )}
    </article>
  );
}
