import { create } from 'zustand';
import { fetchContents, fetchCategories, saveCategories, importContent, confirmContent, updateContent, deleteContent } from '../api/content';
import { loadCategories } from '../lib/categories';

export const useContentStore = create((set, get) => ({
  items: [],
  categories: [],
  categoriesLoading: false,
  loading: false,
  importing: false,
  preview: null,
  error: null,
  filterCategory: 'all',
  viewMode: 'inbox',
  searchQuery: '',

  load: async () => {
    set({ loading: true, error: null });
    try {
      const items = await fetchContents();
      set({ items, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  loadCategories: async () => {
    set({ categoriesLoading: true });
    try {
      let cats = await fetchCategories();
      if (!cats || cats.length === 0) {
        const local = loadCategories();
        if (local && local.length > 0) {
          await saveCategories(local);
          cats = local;
          try { localStorage.removeItem('recall_categories'); } catch {}
        }
      }
      set({ categories: cats || [], categoriesLoading: false });
    } catch (err) {
      set({ categoriesLoading: false, error: err.message });
    }
  },

  saveCategories: async (cats) => {
    try {
      const saved = await saveCategories(cats);
      set({ categories: saved });
    } catch (err) {
      set({ error: err.message });
    }
  },

  import: async (url) => {
    set({ importing: true, error: null, preview: null });
    try {
      const result = await importContent(url);
      set({ preview: result, importing: false });
      get().load();
    } catch (err) {
      set({ error: err.message, importing: false });
    }
  },

  confirm: async (overrides) => {
    const { preview } = get();
    if (!preview) return;
    const payload = overrides ? { ...preview, ...overrides } : preview;
    set({ importing: true, error: null });
    try {
      await confirmContent(payload);
      set({ preview: null, importing: false });
      get().load();
    } catch (err) {
      set({ error: err.message, importing: false });
    }
  },

  remove: async (id) => {
    try {
      await deleteContent(id);
      get().load();
    } catch (err) {
      set({ error: err.message });
    }
  },

  update: async (id, patch) => {
    try {
      await updateContent(id, patch);
      get().load();
    } catch (err) {
      set({ error: err.message });
    }
  },

  setFilter: (category) => set({ filterCategory: category }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSearch: (q) => set({ searchQuery: q }),
  dismissPreview: () => set({ preview: null }),
  dismissError: () => set({ error: null }),
}));
