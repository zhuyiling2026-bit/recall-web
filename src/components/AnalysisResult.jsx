import { X, Tag, Folder, FileText, Check, Loader2 } from 'lucide-react';
import { useContentStore } from '../store/useContentStore';
import styles from './AnalysisResult.module.css';

export default function AnalysisResult() {
  const { preview, importing, confirm, dismissPreview } = useContentStore();

  if (!preview) return null;

  return (
    <div className={styles.overlay} onClick={dismissPreview}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{preview.title}</h3>
          <button className={styles.close} onClick={dismissPreview}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.meta}>
          <span className={styles.category}>
            <Folder size={14} />
            {preview.category}
          </span>
        </div>

        <div className={styles.summaryRow}>
          <FileText size={16} className={styles.icon} />
          <p>{preview.summary}</p>
        </div>

        <div className={styles.tagsRow}>
          <Tag size={14} className={styles.icon} />
          <div className={styles.tags}>
            {preview.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={dismissPreview}>
            Cancel
          </button>
          <button className={styles.confirmBtn} onClick={confirm} disabled={importing}>
            {importing ? (
              <Loader2 size={18} className={styles.spin} />
            ) : (
              <Check size={18} />
            )}
            Save it
          </button>
        </div>
      </div>
    </div>
  );
}
