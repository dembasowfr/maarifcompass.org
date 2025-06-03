
import { useTranslation } from '@/lib/i18n';
// Removed: import { getOpportunities, type Opportunity } from '@/lib/firebase/firestoreService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

interface OpportunitiesPageProps {
  params: {
    locale: string;
  };
}

// Define a type for local opportunities
interface LocalOpportunity {
  id: string;
  titleKey: string;
  detailKey: string;
  imageUrl: string;
  applyUrl: string;
  imageAiHint?: string;
}

export async function generateMetadata({ params: { locale } }: OpportunitiesPageProps): Promise<Metadata> {
  const { t } = await useTranslation(locale, 'common');
  return {
    title: `${t('navbar.opportunities')} | ${t('appName')}`,
    description: t('pages.opportunities.description'),
  };
}

export default async function OpportunitiesPage({ params: { locale } }: OpportunitiesPageProps) {
  const { t } = await useTranslation(locale, 'common');
  // Reverted to local data for opportunities
  const opportunities: LocalOpportunity[] = [
    {
      id: 'opportunity1',
      titleKey: 'pages.opportunities.sample.opportunity1.title',
      detailKey: 'pages.opportunities.sample.opportunity1.detail',
      imageUrl: 'https://placehold.co/600x338.png',
      applyUrl: '#',
      imageAiHint: 'career growth',
    },
    {
      id: 'opportunity2',
      titleKey: 'pages.opportunities.sample.opportunity2.title',
      detailKey: 'pages.opportunities.sample.opportunity2.detail',
      imageUrl: 'https://placehold.co/600x338.png',
      applyUrl: '#',
      imageAiHint: 'internship program',
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
        <Briefcase className="mr-2 h-6 w-6 text-primary" />
        {t('navbar.opportunities')}
      </h1>
      <p className="text-lg text-muted-foreground">
        {t('pages.opportunities.description')}
      </p>
      
      {opportunities.length === 0 ? (
        <Card className="shadow-lg bg-card">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">{t('pages.opportunities.noOpportunities')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {opportunities.map((item) => (
            <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <Link href={item.applyUrl} target="_blank" rel="noopener noreferrer" aria-label={t(item.titleKey)}>
                <div className="relative aspect-video w-full cursor-pointer">
                  <Image
                    src={item.imageUrl}
                    alt={t(item.titleKey)}
                    fill
                    className="object-cover"
                    data-ai-hint={item.imageAiHint || 'career growth'}
                  />
                </div>
              </Link>
              <CardHeader>
                <CardTitle className="text-xl">{t(item.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{t(item.detailKey)}</p>
                <Link href={item.applyUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                  {t('common.applyNow')}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
