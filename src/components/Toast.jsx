import { useEffect } from 'react';
import { useContentStore } from '../store/useContentStore';
import { X } from 'lucide-react';
import styles from './Toast.module.css';

export default function Toast() {
  const error = useContentStore((s) => s.error);
  const dismissError = useContentStore((s) => s.dismissError);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(dismissError, 3000);
    return () => clearTimeout(timer);
  }, [error, dismissError]);

  if (!error) return null;

  return (
    <div className={styles.toast} onClick={dismissError}>
      <span>{error}</span>
      <X size={16} />
    </div>
  );
}
