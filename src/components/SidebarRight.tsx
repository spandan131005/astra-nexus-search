import { useState } from 'react';
import { Sparkles, RefreshCw, Download, Copy, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function SidebarRight() {
  const { sidebarRightOpen, summary, results, isLoading } = useAppStore();
  const [customAnswer, setCustomAnswer] = useState('');
  const { toast } = useToast();

  const handleRegenerateSummary = () => {
    toast({
      title: 'Regenerating summary',
      description: 'AI is creating a new summary of your results.',
    });
  };

  const handleExportMarkdown = () => {
    const content = `# Search Summary

${summary?.bullets.map(bullet => `- ${bullet}`).join('\n') || ''}

## Sources
${summary?.citations.map((citation, i) => `${i + 1}. ${citation.shortRef}`).join('\n') || ''}

## Custom Analysis
${customAnswer}
`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'search-summary.md';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Summary exported',
      description: 'Your search summary has been downloaded as a Markdown file.',
    });
  };

  const handleCopyCitation = (citation: string) => {
    navigator.clipboard.writeText(citation);
    toast({
      title: 'Citation copied',
      description: 'The citation has been copied to your clipboard.',
    });
  };

  return (
    <AnimatePresence>
      {sidebarRightOpen && (
        <motion.aside
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-80 glass-panel border-l flex flex-col h-full"
        >
          <div className="p-4 border-b">
            <h2 className="font-heading font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Brief & Summary
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* AI Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Agent Summary</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRegenerateSummary}
                  disabled={isLoading || !results.length}
                  className="h-7"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Regenerate
                </Button>
              </div>

              {isLoading ? (
                <Card className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="h-4 w-4 text-primary" />
                      </motion.div>
                      Analyzing results...
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-3 bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                  </div>
                </Card>
              ) : summary ? (
                <Card className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Clock className="h-3 w-3" />
                    Generated {new Date(summary.generatedAt).toLocaleTimeString()}
                  </div>
                  <ul className="space-y-2 text-sm">
                    {summary.bullets.map((bullet, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span>{bullet}</span>
                      </motion.li>
                    ))}
                  </ul>
                </Card>
              ) : results.length > 0 ? (
                <Card className="p-4 text-center text-muted-foreground">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Click "Regenerate" to create an AI summary of your results.</p>
                </Card>
              ) : (
                <Card className="p-4 text-center text-muted-foreground">
                  <p className="text-sm">Search for something to see an AI-generated summary here.</p>
                </Card>
              )}
            </div>

            {summary && summary.citations.length > 0 && (
              <>
                <Separator />
                
                {/* Citations */}
                <div className="space-y-3">
                  <h3 className="font-medium">Citations</h3>
                  <div className="space-y-2">
                    {summary.citations.map((citation, i) => (
                      <motion.div
                        key={citation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 group"
                      >
                        <Badge variant="outline" className="mt-0.5 text-xs">
                          {i + 1}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{citation.shortRef}</p>
                        </div>
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyCitation(`[${i + 1}] ${citation.shortRef}`)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const result = results.find(r => r.id === citation.id);
                              if (result) window.open(result.url, '_blank');
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* Custom Answer */}
            <div className="space-y-3">
              <h3 className="font-medium">Compose Answer</h3>
              <Textarea
                value={customAnswer}
                onChange={(e) => setCustomAnswer(e.target.value)}
                placeholder="Write your own analysis or summary using the results above..."
                className="min-h-[120px] resize-none focus-ring"
              />
            </div>
          </div>

          {/* Export Actions */}
          <div className="p-4 border-t">
            <Button
              onClick={handleExportMarkdown}
              disabled={!summary && !customAnswer}
              className="w-full hover-scale"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to Markdown
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}