import { useState, useEffect } from 'react';
import { Search, Mic, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/store';
import { sampleQueries } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  placeholder?: string;
  size?: 'default' | 'large';
  showSuggestions?: boolean;
}

export function SearchBar({ 
  placeholder = 'Ask across web, PDFs, and images...', 
  size = 'default',
  showSuggestions = false 
}: SearchBarProps) {
  const { query, recentSearches, search, isLoading } = useAppStore();
  const [localQuery, setLocalQuery] = useState(query);
  const [showRecent, setShowRecent] = useState(false);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      search(localQuery);
      setShowRecent(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalQuery(suggestion);
    search(suggestion);
    setShowRecent(false);
  };

  const inputClasses = size === 'large' 
    ? 'h-14 text-lg px-6 pr-32' 
    : 'h-10 px-4 pr-24';

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onFocus={() => setShowRecent(true)}
            onBlur={() => setTimeout(() => setShowRecent(false), 200)}
            placeholder={placeholder}
            className={`${inputClasses} pl-10 glass-panel focus-ring`}
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 opacity-60 hover:opacity-100"
              disabled
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 hover-scale"
              disabled={isLoading || !localQuery.trim()}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showRecent && (recentSearches.length > 0 || showSuggestions) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 glass-panel border rounded-lg p-2 z-50"
            >
              {recentSearches.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Recent searches</p>
                  <div className="space-y-1">
                    {recentSearches.slice(0, 5).map((recent, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(recent)}
                        className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded-md transition-colors"
                      >
                        {recent}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {showSuggestions && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 px-2">Sample queries</p>
                  <div className="flex flex-wrap gap-1">
                    {sampleQueries.map((sample, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleSuggestionClick(sample)}
                      >
                        {sample}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}