import { useState, useRef, useEffect } from 'react';
import { Search, X, Settings, Plus, Trash2 } from 'lucide-react';
import { useContentStore } from '../store/useContentStore';
import styles from './CategoryFilter.module.css';

export default function CategoryFilter() {
  const filterCategory = useContentStore((s) => s.filterCategory);
  const viewMode = useContentStore((s) => s.viewMode);
  const searchQuery = useContentStore((s) => s.searchQuery);
  const categories = useContentStore((s) => s.categories);
  const loadCategories = useContentStore((s) => s.loadCategories);
  const saveCategories = useContentStore((s) => s.saveCategories);
  const setFilter = useContentStore((s) => s.setFilter);
  const setViewMode = useContentStore((s) => s.setViewMode);
  const setSearch = useContentStore((s) => s.setSearch);

  const [local, setLocal] = useState(searchQuery);
  const [focused, setFocused] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editList, setEditList] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const timer = useRef(null);
  const active = focused || local;

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSearch = (val) => {
    setLocal(val);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSearch(val.trim()), 150);
  };

  const handleClear = () => { setLocal(''); setSearch(''); };

  const openEdit = () => {
    setEditList([...categories]);
    setNewLabel('');
    setEditing(true);
  };

  const handleLabelChange = (idx, val) => {
    const next = [...editList];
    next[idx] = { ...next[idx], label: val };
    setEditList(next);
  };

  const handleAdd = () => {
    const label = newLabel.trim();
    if (!label) return;
    const key = label.toLowerCase().replace(/\s+/g, '_');
    if (editList.some((c) => c.key === key)) return;
    setEditList([...editList, { key, label }]);
    setNewLabel('');
  };

  const handleRemove = (idx) => {
    setEditList(editList.filter((_, i) => i !== idx));
  };

  const saveEdit = () => {
    const valid = editList.filter((c) => c.label.trim());
    saveCategories(valid);
    setEditing(false);
  };

  const handleReset = () => {
    const defaults = [
      { key: 'education', label: 'Learn' },
      { key: 'business', label: 'Career' },
      { key: 'entertainment', label: 'Fun' },
      { key: 'health', label: 'Life' },
      { key: 'travel', label: 'Travel' },
      { key: 'lifestyle', label: 'Lifestyle' },
    ];
    saveCategories(defaults);
    setEditing(false);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${filterCategory === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.key}
              className={`${styles.tab} ${filterCategory === c.key ? styles.active : ''}`}
              onClick={() => setFilter(c.key)}
            >
              {c.label}
            </button>
          ))}
          <button
            className={`${styles.tab} ${filterCategory === '__other__' ? styles.active : ''}`}
            onClick={() => setFilter('__other__')}
          >
            Other
          </button>
          <button className={styles.editBtn} onClick={openEdit} title="Manage categories">
            <Settings size={14} />
          </button>
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

      {editing && (
        <div className={styles.modalOverlay} onClick={() => setEditing(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Manage Categories</h3>
            <p className={styles.modalHint}>Add, rename, or remove category tabs — synced to your account</p>

            <div className={styles.editList}>
              {editList.map((cat, idx) => (
                <div key={cat.key} className={styles.editRow}>
                  <input
                    className={styles.editInput}
                    value={cat.label}
                    onChange={(e) => handleLabelChange(idx, e.target.value)}
                  />
                  <button className={styles.removeBtn} onClick={() => handleRemove(idx)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.addRow}>
              <input
                className={styles.addInput}
                placeholder="New category..."
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <button className={styles.addBtn} onClick={handleAdd} disabled={!newLabel.trim()}>
                <Plus size={14} />
              </button>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.resetBtn} onClick={handleReset}>Reset to defaults</button>
              <div className={styles.modalRight}>
                <button className={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
                <button className={styles.saveBtn} onClick={saveEdit}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
