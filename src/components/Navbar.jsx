import { BookOpen } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <a href="/" className={styles.brand}>
          <BookOpen size={28} strokeWidth={1.5} />
          <span>Recall</span>
        </a>
        <span className={styles.tagline}>your content companion</span>
      </div>
    </nav>
  );
}
