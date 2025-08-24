import { useEffect, useState } from 'react';
import { Search, Zap, LayoutGrid, List, Filter, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TopBar } from '@/components/TopBar';
import { SidebarLeft } from '@/components/SidebarLeft';
import { SidebarRight } from '@/components/SidebarRight';
import { SearchBar } from '@/components/SearchBar';
import { ResultCard } from '@/components/ResultCard';
import { useAppStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const { 
    query, 
    results, 
    isLoading, 
    error, 
    sidebarLeftOpen, 
    sidebarRightOpen, 
    viewMode,
    filters,
    setFilters,
    toggleSidebarLeft,
    toggleSidebarRight
  } = useAppStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) return;
      
      switch (e.key) {
        case '/':
          e.preventDefault();
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          searchInput?.focus();
          break;
        case 'f':
          if (!e.target || (e.target as HTMLElement).tagName !== 'INPUT') {
            e.preventDefault();
            toggleSidebarLeft();
          }
          break;
        case '?':
          if (!e.target || (e.target as HTMLElement).tagName !== 'INPUT') {
            e.preventDefault();
            // Show shortcuts modal
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebarLeft]);

  const activeFiltersCount = 
    Object.values(filters.sources).filter(v => !v).length +
    (filters.dateRange !== 'any' ? 1 : 0) +
    filters.fileTypes.length +
    filters.domains.include.length +
    filters.domains.exclude.length +
    (filters.language !== 'en' ? 1 : 0) +
    (filters.sortBy !== 'relevance' ? 1 : 0);

  const clearAllFilters = () => {
    setFilters({
      sources: { web: true, pdfs: true, images: true, tables: true },
      dateRange: 'any',
      fileTypes: [],
      domains: { include: [], exclude: [] },
      language: 'en',
      sortBy: 'relevance',
    });
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Skip to content for accessibility */}
      <a href="#main-content" className="skip-link focus-ring">
        Skip to main content
      </a>

      <div className="flex h-screen w-full">
        {/* Left Sidebar */}
        <SidebarLeft />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          
          <main id="main-content" className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Search Area (when no results) */}
              {!query && !results.length && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex items-center justify-center p-8"
                >
                  <div className="text-center max-w-2xl space-y-8">
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                      <h1 className="font-heading text-3xl font-bold">Ready when you are</h1>
                      <p className="text-lg text-muted-foreground">
                        Upload a PDF or search the web to get unified results across all modalities.
                      </p>
                    </div>
                    
                    <div className="max-w-xl mx-auto">
                      <SearchBar size="large" showSuggestions={true} />
                    </div>

                    <div className="flex justify-center">
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          const sampleQuery = "LLM evaluation techniques";
                          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                          if (searchInput) {
                            searchInput.value = sampleQuery;
                            const form = searchInput.closest('form');
                            if (form) {
                              form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                            }
                          }
                        }}
                        className="hover-scale"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Try a sample query
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Results Area */}
              {(query || results.length > 0) && (
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-6">
                    {/* Search Summary Row */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              >
                                <Search className="h-4 w-4" />
                              </motion.div>
                              Searching...
                            </div>
                          ) : results.length > 0 ? (
                            <span>
                              Found <strong>{results.length}</strong> results 
                              {query && <span> for "{query}"</span>}
                            </span>
                          ) : query && !isLoading ? (
                            <span>No results found for "{query}"</span>
                          ) : null}
                        </div>

                        {activeFiltersCount > 0 && (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              <Filter className="h-3 w-3 mr-1" />
                              {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearAllFilters}
                              className="text-xs h-6"
                            >
                              Clear
                            </Button>
                          </div>
                        )}
                      </div>

                      {results.length > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="hidden sm:flex items-center gap-1">
                            <Button
                              variant={viewMode === 'grid' ? 'default' : 'ghost'}
                              size="sm"
                              onClick={() => useAppStore.getState().setViewMode('grid')}
                              className="focus-ring"
                            >
                              <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={viewMode === 'list' ? 'default' : 'ghost'}
                              size="sm"
                              onClick={() => useAppStore.getState().setViewMode('list')}
                              className="focus-ring"
                            >
                              <List className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>

                    {/* Loading Skeletons */}
                    {isLoading && (
                      <div className={`grid gap-6 ${
                        viewMode === 'grid' 
                          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                          : 'grid-cols-1'
                      }`}>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <div className="card-elegant p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-4 w-8" />
                              </div>
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                              <div className="space-y-2">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-5/6" />
                                <Skeleton className="h-3 w-4/6" />
                              </div>
                              <div className="flex gap-2">
                                <Skeleton className="h-8 flex-1" />
                                <Skeleton className="h-8 w-20" />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Error State */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                      >
                        <div className="text-destructive mb-2">Search Error</div>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Button 
                          onClick={() => query && useAppStore.getState().search(query)}
                          variant="outline"
                        >
                          Try Again
                        </Button>
                      </motion.div>
                    )}

                    {/* Results Grid/List */}
                    {!isLoading && results.length > 0 && (
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={viewMode}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`grid gap-6 ${
                            viewMode === 'grid' 
                              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                              : 'grid-cols-1 max-w-4xl'
                          }`}
                        >
                          {results.map((result, index) => (
                            <ResultCard key={result.id} result={result} index={index} />
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    )}

                    {/* No Results State */}
                    {!isLoading && query && results.length === 0 && !error && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                      >
                        <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="font-heading text-lg font-medium mb-2">No results found</h3>
                        <p className="text-muted-foreground mb-6">
                          Try adjusting your search terms or filters
                        </p>
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" onClick={clearAllFilters}>
                            Clear filters
                          </Button>
                          <Button onClick={() => {
                            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                            if (input) {
                              input.focus();
                              input.select();
                            }
                          }}>
                            Try different terms
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Right Sidebar */}
        <SidebarRight />
      </div>
    </div>
  );
}