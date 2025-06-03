
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { getDocumentById, type DocumentItem } from '@/lib/firebase/firestoreService';
import { Button } from '@/components/ui/button';
import { DownloadCloud, FileWarning } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface DocumentViewPageProps {
  params: {
    locale: string;
    docId: string;
  };
}

export async function generateMetadata({ params }: DocumentViewPageProps): Promise<Metadata> {
  const { t } = await useTranslation(params.locale, 'common');
  const document = await getDocumentById(params.docId, params.locale);

  if (!document) {
    return {
      title: t('common.notFound'),
    };
  }
  return {
    title: `${document.name} | ${t('navbar.documentCenter')} | ${t('appName')}`,
    description: document.description,
  };
}

export default async function DocumentViewPage({ params }: DocumentViewPageProps) {
  const { locale, docId } = params;
  const { t } = await useTranslation(locale, 'common');
  const document = await getDocumentById(docId, locale);

  if (!document) {
    notFound();
  }

  const isPdf = document.fileUrl && document.fileUrl.toLowerCase().includes('.pdf');

  return (
    <div className="space-y-6">
      <nav aria-label="breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link href={`/${locale}/document-center`} className="hover:underline">
              {t('navbar.documentCenter')}
            </Link>
          </li>
          <li>
            <span>/</span>
          </li>
          <li className="font-medium text-foreground truncate" aria-current="page">
            {document.name}
          </li>
        </ol>
      </nav>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">{document.name}</CardTitle>
          {document.description && (
            <CardDescription className="text-base pt-2">{document.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button asChild size="lg">
              <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" download>
                <DownloadCloud className="mr-2 h-5 w-5" />
                {t('documentViewPage.downloadButton')}
              </a>
            </Button>
            <p className="text-xs text-muted-foreground">
                {t('documentViewPage.downloadHint')}
            </p>
          </div>

          {isPdf ? (
            <div className="aspect-[8.5/11] w-full max-w-4xl mx-auto bg-muted rounded-md overflow-hidden border">
              <iframe
                src={document.fileUrl}
                width="100%"
                height="100%"
                title={document.name}
                className="border-0"
              />
            </div>
          ) : (
            <div className="p-6 border rounded-md bg-muted/50 text-center">
              <FileWarning className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                {t('documentViewPage.previewNotAvailable')}
              </p>
               <p className="text-sm text-muted-foreground mt-1">
                {t('documentViewPage.downloadToView')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
