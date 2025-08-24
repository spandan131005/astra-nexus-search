import { Sparkles, Upload, Settings, Menu, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { useAppStore } from '@/store';
import { motion } from 'framer-motion';

export function TopBar() {
  const { 
    toggleSidebarLeft, 
    toggleSidebarRight, 
    viewMode, 
    setViewMode,
    results,
    isLoading 
  } = useAppStore();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 glass-panel border-b backdrop-blur-xl"
    >
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Left side - Logo and menu */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebarLeft}
            className="focus-ring"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading font-semibold text-lg hidden sm:block">
              AstraFind
            </span>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-2xl">
          <SearchBar />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {results.length > 0 && (
            <div className="hidden sm:flex items-center gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="focus-ring"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="focus-ring"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <Button variant="ghost" size="sm" className="focus-ring" disabled>
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Upload</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="focus-ring" disabled>
            <Settings className="h-4 w-4" />
          </Button>
          
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebarRight}
            className="focus-ring"
          >
            <Badge variant="secondary" className="h-6 px-2">
              AI
            </Badge>
          </Button>
        </div>
      </div>
      
      {isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent animate-pulse-glow" />
      )}
    </motion.header>
  );
}