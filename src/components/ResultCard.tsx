import { useState } from 'react';
import { ExternalLink, Copy, Plus, Image as ImageIcon, FileText, Table, Globe, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { ResultItem } from '@/store';
import { motion } from 'framer-motion';

interface ResultCardProps {
  result: ResultItem;
  index: number;
}

export function ResultCard({ result, index }: ResultCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const modalityIcons = {
    text: Globe,
    pdf: FileText,
    image: ImageIcon,
    table: Table,
  };

  const modalityColors = {
    text: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    pdf: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    image: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    table: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  };

  const ModalityIcon = modalityIcons[result.modality];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(result.url);
    toast({
      title: 'Link copied',
      description: 'The result URL has been copied to your clipboard.',
    });
  };

  const handleAddToBrief = () => {
    toast({
      title: 'Added to brief',
      description: 'This result has been added to your AI brief.',
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
      >
        <Card className="card-elegant hover-lift p-4 h-full flex flex-col focus-ring">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Badge className={modalityColors[result.modality]}>
                <ModalityIcon className="h-3 w-3 mr-1" />
                {result.modality.toUpperCase()}
              </Badge>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">{result.score}</span>
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddToBrief}
                className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-heading font-semibold text-sm leading-tight mb-2 line-clamp-2">
              {result.title}
            </h3>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <span className="font-medium">{result.sourceDomain}</span>
              {result.publishedAt && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(result.publishedAt).toLocaleDateString()}</span>
                  </div>
                </>
              )}
            </div>

            {result.snippet && (
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {result.snippet}
              </p>
            )}

            {result.highlights && result.highlights.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {result.highlights.slice(0, 3).map((highlight, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {highlight}
                  </Badge>
                ))}
              </div>
            )}

            {result.tablePreview && (
              <div className="bg-muted/50 rounded-md p-2 mb-3">
                <div className="text-xs font-medium mb-1">Table Preview</div>
                <div className="text-xs text-muted-foreground">
                  {result.tablePreview.headers.length} columns, {result.tablePreview.rows.length} rows
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(result.url, '_blank')}
              className="flex-1 hover-scale"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open
            </Button>
            
            {(result.thumbnailUrl || result.tablePreview) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="hover-scale"
              >
                Preview
              </Button>
            )}
          </div>
        </Card>
      </motion.div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{result.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {result.thumbnailUrl && (
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={result.thumbnailUrl} 
                  alt={result.title}
                  className="w-full h-auto"
                />
              </div>
            )}
            
            {result.tablePreview && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted/50">
                      {result.tablePreview.headers.map((header, i) => (
                        <th key={i} className="border border-border px-3 py-2 text-left text-sm font-medium">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.tablePreview.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-muted/20">
                        {row.map((cell, j) => (
                          <td key={j} className="border border-border px-3 py-2 text-sm">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {result.snippet && (
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{result.snippet}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}