import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface DataTableState {
  searchTerm: string;
  filters: Record<string, string>;
  page: number;
  showFilters: boolean;
  isSearching: boolean;
  setSearchTerm: (value: string) => void;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  toggleFilters: () => void;
  setIsSearching: (value: boolean) => void;
  reset: () => void;
}

export const useDataTableStore = create<DataTableState>()(
  devtools(
    (set) => ({
      searchTerm: '',
      filters: {},
      page: 1,
      showFilters: false,
      isSearching: false,

      setSearchTerm: (value) => 
        set({ 
          searchTerm: value,
          isSearching: true,
        }),

      setFilter: (key, value) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
          },
          isSearching: true,
        })),

      clearFilters: () => 
        set({ 
          filters: {},
          isSearching: true,
        }),

      setPage: (page) => 
        set({ page }),

      toggleFilters: () =>
        set((state) => ({ 
          showFilters: !state.showFilters 
        })),

      setIsSearching: (value) =>
        set({ isSearching: value }),

      reset: () =>
        set({
          searchTerm: '',
          filters: {},
          page: 1,
          showFilters: false,
          isSearching: false,
        }),
    })
  )
); 