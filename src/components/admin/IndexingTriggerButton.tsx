
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { runDocumentIndexing, type IndexingStats } from '@/ai/flows/indexingFlow';
import { useToast } from '@/hooks/use-toast';
import { PlayCircle, Loader2, DatabaseZap, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';

interface IndexingTriggerButtonProps {
  locale: string;
}

export default function IndexingTriggerButton({ locale }: IndexingTriggerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation(locale, 'common');

  const handleRunIndexing = async () => {
    setIsLoading(true);
    try {
      const stats: IndexingStats = await runDocumentIndexing();
      
      let descriptionLines = [
        t('indexingTrigger.processed', { count: stats.documentsProcessed }),
        t('indexingTrigger.parsed', { count: stats.documentsSuccessfullyParsed }),
        t('indexingTrigger.cached', { count: stats.documentsUsingCachedText }),
        t('indexingTrigger.failed', { count: stats.documentsFailedToParse }),
        t('indexingTrigger.chunks', { count: stats.chunksCreated }),
        t('indexingTrigger.embeddings', { count: stats.embeddingsGenerated }),
      ];

      if (stats.warningMessage) {
        descriptionLines.push(`\n${t('indexingTrigger.warningTitle')}: ${stats.warningMessage}`);
      }

      toast({
        title: stats.warningMessage ? t('indexingTrigger.successWithWarningTitle') : t('indexingTrigger.successTitle'),
        description: (
          <div className="text-xs space-y-0.5 whitespace-pre-wrap">
            {descriptionLines.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        ),
        variant: stats.warningMessage ? "default" : "default", // could be "destructive" for certain warnings
        duration: stats.warningMessage ? 20000 : 15000, 
      });

    } catch (error) {
      console.error("Error running document indexing from UI:", error);
      toast({
        variant: "destructive",
        title: t('indexingTrigger.errorTitle'),
        description: error instanceof Error ? error.message : String(error),
        duration: 10000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleRunIndexing} disabled={isLoading} variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <DatabaseZap className="mr-2 h-4 w-4" />
      )}
      {isLoading ? t('indexingTrigger.loadingButton') : t('indexingTrigger.button')}
    </Button>
  );
}
