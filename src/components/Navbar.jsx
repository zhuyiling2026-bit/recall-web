import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';
import { supabase, clearToken } from '../lib/supabase';
import styles from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearToken();
    navigate('/');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <a href="/" className={styles.brand}>
          <BookOpen size={28} strokeWidth={1.5} />
          <span>Recall</span>
        </a>
        <span className={styles.tagline}>your content companion</span>
      </div>
      <button onClick={handleLogout} className={styles.logoutBtn} title="Sign out">
        <LogOut size={18} />
      </button>
    </nav>
  );
}
