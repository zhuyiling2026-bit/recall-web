import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { useContentStore } from '../store/useContentStore';
import styles from './ImportForm.module.css';

function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export default function ImportForm() {
  const [url, setUrl] = useState('');
  const [touched, setTouched] = useState(false);
  const { import: importAction, importing, error, dismissError } = useContentStore();

  const urlValid = url.trim() && isValidUrl(url.trim());
  const showError = touched && url.trim() && !isValidUrl(url.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!urlValid) return;
    await importAction(url.trim());
    setUrl('');
    setTouched(false);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Save something new</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputWrap}>
          <input
            className={`${styles.input} ${showError ? styles.inputError : ''}`}
            type="url"
            placeholder="Paste a URL to analyze & save..."
            value={url}
            onChange={(e) => { setUrl(e.target.value); setTouched(true); }}
            onBlur={() => setTouched(true)}
            required
          />
          {showError && (
            <span className={styles.fieldError}>Please enter a valid URL</span>
          )}
        </div>
        <button className={styles.btn} type="submit" disabled={importing || !urlValid}>
          {importing ? (
            <Loader2 size={20} className={styles.spin} />
          ) : (
            <Plus size={20} />
          )}
          <span>{importing ? 'Analyzing...' : 'Import'}</span>
        </button>
      </form>
      {error && (
        <div className={styles.error} onClick={dismissError}>
          {error}
          <span className={styles.errorHint}>click to dismiss</span>
        </div>
      )}
    </section>
  );
}
