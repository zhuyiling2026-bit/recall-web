import { Trash2, X } from 'lucide-react';
import { useContentStore } from '../store/useContentStore';
import styles from './TrashFAB.module.css';

export default function TrashFAB() {
  const viewMode = useContentStore((s) => s.viewMode);
  const setViewMode = useContentStore((s) => s.setViewMode);

  const inTrash = viewMode === 'trash';

  return (
    <button
      className={styles.fab}
      onClick={() => setViewMode(inTrash ? 'inbox' : 'trash')}
      title={inTrash ? '返回收件箱' : '回收站'}
    >
      {inTrash ? <X size={22} /> : <Trash2 size={22} />}
    </button>
  );
}
