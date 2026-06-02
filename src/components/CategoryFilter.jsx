import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useContentStore } from '../store/useContentStore';
import styles from './CategoryFilter.module.css';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'education', label: 'Learn' },
  { key: 'business', label: 'Career' },
  { key: 'entertainment', label: 'Fun' },
  { key: 'health', label: 'Life' },
];

export default function CategoryFilter() {
  const filterCategory = useContentStore((s) => s.filterCategory);
  const viewMode = useContentStore((s) => s.viewMode);
  const searchQuery = useContentStore((s) => s.searchQuery);
  const setFilter = useContentStore((s) => s.setFilter);
  const setViewMode = useContentStore((s) => s.setViewMode);
  const setSearch = useContentStore((s) => s.setSearch);

  const [local, setLocal] = useState(searchQuery);
  const [focused, setFocused] = useState(false);
  const timer = useRef(null);
  const active = focused || local;

  const handleSearch = (val) => {
    setLocal(val);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSearch(val.trim()), 150);
  };

  const handleClear = () => {
    setLocal('');
    setSearch('');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`${styles.tab} ${filterCategory === c.key ? styles.active : ''}`}
            onClick={() => setFilter(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={`${styles.searchWrap} ${active ? styles.searchActive : ''}`}>
        <Search size={14} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder={focused ? 'Search titles, tags...' : 'Search'}
          value={local}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {local && (
          <button className={styles.searchClear} onClick={handleClear}>
            <X size={12} />
          </button>
        )}
      </div>

      <div className={styles.views}>
        <button
          className={`${styles.viewBtn} ${viewMode === 'inbox' ? styles.viewActive : ''}`}
          onClick={() => setViewMode('inbox')}
        >
          Inbox
        </button>
        <button
          className={`${styles.viewBtn} ${viewMode === 'review' ? styles.viewActive : ''}`}
          onClick={() => setViewMode('review')}
        >
          To Review
        </button>
      </div>
    </div>
  );
}
