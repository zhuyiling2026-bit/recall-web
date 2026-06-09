import { useState } from 'react';
import { X, Tag, Folder, FileText, Check } from 'lucide-react';
import { useContentStore } from '../store/useContentStore';
import styles from './AnalysisResult.module.css';

export default function AnalysisResult() {
  const { preview, importing, categories, confirm, dismissPreview } = useContentStore();
  const [selectedCat, setSelectedCat] = useState(null);

  if (!preview) return null;

  const category = selectedCat ?? preview.category;

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
          </span>
          <select
            className={styles.categorySelect}
            value={category}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
            <option value="other">Other</option>
          </select>
        </div>

        <div className={styles.summaryRow}>
          <FileText size={16} className={styles.icon} />
          <p>{preview.summary}</p>
        </div>

        <div className={styles.tagsRow}>
          <Tag size={14} className={styles.icon} />
          <div className={styles.tags}>
            {(preview.tags || []).map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.confirmBtn}
            onClick={() => confirm(category !== preview.category ? { category } : undefined)}
            disabled={importing}
          >
            <Check size={18} />
            {importing ? '保存中…' : '完成'}
          </button>
        </div>
      </div>
    </div>
  );
}
