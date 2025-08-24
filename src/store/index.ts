import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Modality = 'text' | 'pdf' | 'image' | 'table';

export interface ResultItem {
  id: string;
  modality: Modality;
  title: string;
  url: string;
  sourceDomain: string;
  publishedAt?: string;
  score: number; // 0..100 semantic relevance
  snippet?: string;
  highlights?: string[];
  thumbnailUrl?: string; // pdf page or image
  tablePreview?: { headers: string[]; rows: string[][] }; // for table modality
}

export interface Summary {
  bullets: string[];
  citations: { id: string; shortRef: string }[];
  generatedAt: string;
}

export interface SearchFilters {
  sources: {
    web: boolean;
    pdfs: boolean;
    images: boolean;
    tables: boolean;
  };
  dateRange: 'any' | '24h' | '7d' | '30d' | 'custom';
  customDateStart?: string;
  customDateEnd?: string;
  fileTypes: string[];
  domains: {
    include: string[];
    exclude: string[];
  };
  language: string;
  sortBy: 'relevance' | 'recency' | 'quality';
}

export interface UploadFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'indexed' | 'failed';
  progress: number;
  error?: string;
}

interface AppState {
  // Search state
  query: string;
  results: ResultItem[];
  summary: Summary | null;
  isLoading: boolean;
  error: string | null;
  
  // Filters
  filters: SearchFilters;
  
  // UI state
  sidebarLeftOpen: boolean;
  sidebarRightOpen: boolean;
  viewMode: 'grid' | 'list';
  
  // Upload state
  uploads: UploadFile[];
  
  // Recent searches
  recentSearches: string[];
  
  // Actions
  setQuery: (query: string) => void;
  setResults: (results: ResultItem[]) => void;
  setSummary: (summary: Summary | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  toggleSidebarLeft: () => void;
  toggleSidebarRight: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  addUpload: (file: UploadFile) => void;
  updateUpload: (id: string, updates: Partial<UploadFile>) => void;
  removeUpload: (id: string) => void;
  addRecentSearch: (query: string) => void;
  search: (query: string) => Promise<void>;
}

const defaultFilters: SearchFilters = {
  sources: {
    web: true,
    pdfs: true,
    images: true,
    tables: true,
  },
  dateRange: 'any',
  fileTypes: [],
  domains: {
    include: [],
    exclude: [],
  },
  language: 'en',
  sortBy: 'relevance',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      query: '',
      results: [],
      summary: null,
      isLoading: false,
      error: null,
      filters: defaultFilters,
      sidebarLeftOpen: true,
      sidebarRightOpen: true,
      viewMode: 'grid',
      uploads: [],
      recentSearches: [],

      // Actions
      setQuery: (query) => set({ query }),
      setResults: (results) => set({ results }),
      setSummary: (summary) => set({ summary }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setFilters: (newFilters) => 
        set((state) => ({ 
          filters: { ...state.filters, ...newFilters } 
        })),
      toggleSidebarLeft: () => 
        set((state) => ({ sidebarLeftOpen: !state.sidebarLeftOpen })),
      toggleSidebarRight: () => 
        set((state) => ({ sidebarRightOpen: !state.sidebarRightOpen })),
      setViewMode: (viewMode) => set({ viewMode }),
      addUpload: (file) => 
        set((state) => ({ uploads: [...state.uploads, file] })),
      updateUpload: (id, updates) =>
        set((state) => ({
          uploads: state.uploads.map((file) =>
            file.id === id ? { ...file, ...updates } : file
          ),
        })),
      removeUpload: (id) =>
        set((state) => ({
          uploads: state.uploads.filter((file) => file.id !== id),
        })),
      addRecentSearch: (query) =>
        set((state) => ({
          recentSearches: [
            query,
            ...state.recentSearches.filter((q) => q !== query),
          ].slice(0, 10),
        })),
      
      // Mock search function
      search: async (query: string) => {
        const { setQuery, setLoading, setResults, setSummary, setError, addRecentSearch } = get();
        
        setQuery(query);
        setLoading(true);
        setError(null);
        addRecentSearch(query);
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Import mock data and set results
          const { getMockResults, getMockSummary } = await import('../lib/mockData');
          const results = getMockResults(query);
          const summary = getMockSummary(query);
          
          setResults(results);
          setSummary(summary);
        } catch (error) {
          setError('Failed to search. Please try again.');
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: 'astra-app-state',
      partialize: (state) => ({
        filters: state.filters,
        sidebarLeftOpen: state.sidebarLeftOpen,
        sidebarRightOpen: state.sidebarRightOpen,
        viewMode: state.viewMode,
        recentSearches: state.recentSearches,
      }),
    }
  )
);