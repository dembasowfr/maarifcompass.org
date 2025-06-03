import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, DownloadCloud, Sparkles, AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getDocuments, type DocumentItem } from '@/lib/firebase/firestoreService';
import IndexingTriggerButton from '@/components/admin/IndexingTriggerButton'; // New Import

interface DocumentCenterPageProps {
  params: {
    locale: string;
  };
}

// CORRECTED: Await params before destructuring in generateMetadata
export async function generateMetadata({ params }: DocumentCenterPageProps): Promise<Metadata> {
  const { locale } = await params; // <--- THIS LINE IS ADDED, AND 'params' IS PASSED INTACT
  
  const { t } = await useTranslation(locale, 'common');
  return {
    title: `${t('navbar.documentCenter')} | ${t('appName')}`,
    description: t('pages.documentCenter.intro'),
  };
}

// Helper to check for problematic Google Drive "view" links for images
const isProblematicGoogleDriveImageLink = (url: string | undefined): boolean => {
  if (!url) return false;
  const googleDriveViewPattern = /^https:\/\/drive\.google\.com\/file\/d\/[^/]+\/(view|edit)(\?usp=.*)?$/;
  return googleDriveViewPattern.test(url);
};

// CORRECTED: Await params before destructuring in DocumentCenterPage component
export default async function DocumentCenterPage({ params }: DocumentCenterPageProps) {
  const { locale } = await params; // <--- THIS LINE IS ADDED, AND 'params' IS PASSED INTACT
  
  const { t } = await useTranslation(locale, 'common');
  const documents: DocumentItem[] = await getDocuments(locale);

  return (
    <div className="space-y-8">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center justify-center md:justify-start">
          <FileText className="mr-3 h-7 w-7 text-primary" />
          {t('navbar.documentCenter')}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('pages.documentCenter.intro')}
        </p>
      </header>

      {/* Temporary Indexing Button - For Testing Phase 2 */}
      <Card className="my-6 border-primary/50 shadow-md bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <AlertTriangle className="mr-2 h-5 w-5" />
            {t('indexingTrigger.sectionTitle')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('indexingTrigger.sectionDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IndexingTriggerButton locale={locale} />
           <p className="mt-3 text-xs text-muted-foreground">
            {t('indexingTrigger.sectionNote')}
          </p>
        </CardContent>
      </Card>
      {/* End Temporary Indexing Button */}

      {documents.length === 0 ? (
        <Card className="shadow-lg bg-card">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">{t('pages.documentCenter.noDocuments')}</p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              {t('pages.documentCenter.adminInstructions')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => {
            const useActualImage = doc.imageUrl &&
                                   !doc.imageUrl.startsWith('https://placehold.co') &&
                                   !isProblematicGoogleDriveImageLink(doc.imageUrl);

            const imageToDisplay = useActualImage ? doc.imageUrl : 'https://placehold.co/600x400.png';
            const imageAltText = doc.name || t('pages.documentCenter.documentImageAlt');
            const docDetailUrl = `/${locale}/document-center/${doc.id}`;

            return (
              <Card
                key={doc.id}
                className="shadow-md hover:shadow-lg transition-shadow flex flex-col overflow-hidden document-card min-h-[300px]"
              >
                <Link
                  href={docDetailUrl}
                  aria-label={`${t('pages.documentCenter.viewDocumentAria', { documentName: doc.name || t('pages.documentCenter.untitledDocument') })}`}
                  className="block"
                >
                  <div className="relative aspect-[3/2] w-full cursor-pointer bg-muted/30">
                    <Image
                      src={imageToDisplay}
                      alt={imageAltText}
                      fill
                      className="object-cover"
                      data-ai-hint={doc.imageAiHint || 'document cover'}
                    />
                  </div>
                </Link>
                <CardHeader>
                  <CardTitle className="text-xl text-card-foreground">
                    <Link href={docDetailUrl} className="hover:underline">
                      {doc.name || t('pages.documentCenter.untitledDocument')}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-muted-foreground line-clamp-3">
                    {doc.description || t('pages.documentCenter.noDescription')}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant="outline">
                    <Link href={docDetailUrl}>
                      <FileText className="mr-2 h-4 w-4 document-card-icon" />
                      {t('pages.documentCenter.viewDocument')}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* CompassIA Promotion Card */}
      <Card className="mt-8 bg-primary/10 border-primary/30 shadow-lg">
        <CardHeader className="items-center text-center">
          <Sparkles className="h-10 w-10 text-primary mb-2" />
          <CardTitle className="text-2xl text-primary">
            {t('pages.documentCenter.compassIA.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            {t('pages.documentCenter.compassIA.description')}
          </p>
          <Button
            asChild
            size="lg"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <Link
              href={`/${locale}/ai-assistant`}
              className="flex items-center gap-2 text-primary-foreground hover:text-primary-foreground"
            >
              <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
              <span>{t('pages.documentCenter.compassIA.button')}</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}