
import { useTranslation } from '@/lib/i18n';
// Removed: import { getNewsArticles, type NewsArticle } from '@/lib/firebase/firestoreService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

interface HaberlerPageProps {
  params: {
    locale: string;
  };
}

// Define a type for local news articles
interface LocalNewsArticle {
  id: string;
  titleKey: string;
  summaryKey: string;
  imageUrl: string;
  date: string; // Keep as string for local data simplicity
  articleUrl: string;
  imageAiHint?: string;
}

export async function generateMetadata({ params: { locale } }: HaberlerPageProps): Promise<Metadata> {
  const { t } = await useTranslation(locale, 'common');
  return {
    title: `${t('navbar.haberler')} | ${t('appName')}`,
    description: t('pages.haberler.description'),
  };
}

export default async function HaberlerPage({ params: { locale } }: HaberlerPageProps) {
  const { t } = await useTranslation(locale, 'common');
  // Reverted to local data for news articles
  const newsArticles: LocalNewsArticle[] = [
    {
      id: 'news1',
      titleKey: 'pages.haberler.sample.news1.title',
      summaryKey: 'pages.haberler.sample.news1.summary',
      imageUrl: 'https://placehold.co/600x338.png',
      date: 'October 26, 2023',
      articleUrl: '#',
      imageAiHint: 'news article',
    },
    {
      id: 'news2',
      titleKey: 'pages.haberler.sample.news2.title',
      summaryKey: 'pages.haberler.sample.news2.summary',
      imageUrl: 'https://placehold.co/600x338.png',
      date: 'October 20, 2023',
      articleUrl: '#',
      imageAiHint: 'community update',
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
        <Newspaper className="mr-2 h-6 w-6 text-primary" />
        {t('navbar.haberler')}
      </h1>
      <p className="text-lg text-muted-foreground">
        {t('pages.haberler.description')}
      </p>

      {newsArticles.length === 0 ? (
         <Card className="shadow-lg bg-card">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">{t('pages.haberler.noNews')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsArticles.map((article) => (
            <Card key={article.id} className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <Link href={article.articleUrl} target="_blank" rel="noopener noreferrer" aria-label={t(article.titleKey)}>
                <div className="relative aspect-video w-full cursor-pointer">
                  <Image
                    src={article.imageUrl}
                    alt={t(article.titleKey)}
                    fill
                    className="object-cover"
                    data-ai-hint={article.imageAiHint || 'news article'}
                  />
                </div>
              </Link>
              <CardHeader>
                <CardTitle className="text-xl">{t(article.titleKey)}</CardTitle>
                <p className="text-xs text-muted-foreground">{article.date}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{t(article.summaryKey)}</p>
                <Link href={article.articleUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                  {t('common.readMore')}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
