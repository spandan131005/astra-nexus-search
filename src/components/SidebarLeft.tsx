import { useState } from 'react';
import { Globe, FileText, Image, Table, Calendar, Filter, ArrowUpDown, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';

export function SidebarLeft() {
  const { sidebarLeftOpen, filters, setFilters } = useAppStore();
  const [sourcesOpen, setSourcesOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);

  const updateSourceFilter = (source: keyof typeof filters.sources, checked: boolean) => {
    setFilters({
      sources: {
        ...filters.sources,
        [source]: checked,
      },
    });
  };

  const updateDateRange = (range: typeof filters.dateRange) => {
    setFilters({ dateRange: range });
  };

  const updateSortBy = (sortBy: typeof filters.sortBy) => {
    setFilters({ sortBy });
  };

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

  const activeFiltersCount = 
    Object.values(filters.sources).filter(v => !v).length +
    (filters.dateRange !== 'any' ? 1 : 0) +
    filters.fileTypes.length +
    filters.domains.include.length +
    filters.domains.exclude.length +
    (filters.language !== 'en' ? 1 : 0) +
    (filters.sortBy !== 'relevance' ? 1 : 0);

  return (
    <AnimatePresence>
      {sidebarLeftOpen && (
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-72 glass-panel border-r flex flex-col h-full"
        >
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </h2>
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs h-7"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Sources */}
            <Collapsible open={sourcesOpen} onOpenChange={setSourcesOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium">
                  Sources
                  <ChevronDown className={`h-4 w-4 transition-transform ${sourcesOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                <div className="space-y-2">
                  {[
                    { key: 'web' as const, label: 'Web', icon: Globe },
                    { key: 'pdfs' as const, label: 'PDFs', icon: FileText },
                    { key: 'images' as const, label: 'Images', icon: Image },
                    { key: 'tables' as const, label: 'Tables/Charts', icon: Table },
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={filters.sources[key]}
                        onCheckedChange={(checked) => updateSourceFilter(key, !!checked)}
                      />
                      <Label htmlFor={key} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Icon className="h-4 w-4" />
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Date Range */}
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date Range
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                <Select value={filters.dateRange} onValueChange={updateDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
                
                {filters.dateRange === 'custom' && (
                  <div className="space-y-2">
                    <Input type="date" placeholder="Start date" className="text-sm" />
                    <Input type="date" placeholder="End date" className="text-sm" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Language</Label>
                  <Select value={filters.language} onValueChange={(value) => setFilters({ language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Domains (include)</Label>
                  <Input 
                    placeholder="e.g., arxiv.org, github.com"
                    className="text-sm"
                  />
                  <Label className="text-sm font-medium">Domains (exclude)</Label>
                  <Input 
                    placeholder="e.g., example.com"
                    className="text-sm"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />

            {/* Sort */}
            <Collapsible open={sortOpen} onOpenChange={setSortOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto font-medium">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort by
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                <Select value={filters.sortBy} onValueChange={updateSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="recency">Recency</SelectItem>
                    <SelectItem value="quality">Source quality</SelectItem>
                  </SelectContent>
                </Select>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Keyboard shortcuts help */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-muted-foreground"
              disabled
            >
              <HelpCircle className="h-3 w-3 mr-2" />
              Press ? for shortcuts
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}