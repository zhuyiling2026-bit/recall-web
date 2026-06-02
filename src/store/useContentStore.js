import { create } from 'zustand';
import { fetchContents, importContent, confirmContent, updateContent } from '../api/content';

export const useContentStore = create((set, get) => ({
  items: [],
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

  import: async (url) => {
    set({ importing: true, error: null, preview: null });
    try {
      const result = await importContent(url);
      set({ preview: result, importing: false });
    } catch (err) {
      set({ error: err.message, importing: false });
    }
  },

  confirm: async () => {
    const { preview } = get();
    if (!preview) return;
    set({ importing: true, error: null });
    try {
      await confirmContent(preview);
      set({ preview: null, importing: false });
      get().load();
    } catch (err) {
      set({ error: err.message, importing: false });
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
