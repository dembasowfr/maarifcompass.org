
import { useTranslation } from '@/lib/i18n';
// Removed: import { getEvents, type EventItem } from '@/lib/firebase/firestoreService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

interface EtkinliklerPageProps {
  params: {
    locale: string;
  };
}

// Define a type for local events
interface LocalEventItem {
  id: string;
  titleKey: string;
  summaryKey: string;
  imageUrl: string;
  date: string; // Keep as string for local data simplicity
  eventUrl: string;
  imageAiHint?: string;
}

export async function generateMetadata({ params: { locale } }: EtkinliklerPageProps): Promise<Metadata> {
  const { t } = await useTranslation(locale, 'common');
  return {
    title: `${t('navbar.etkinlikler')} | ${t('appName')}`,
    description: t('pages.etkinlikler.description'),
  };
}

export default async function EtkinliklerPage({ params: { locale } }: EtkinliklerPageProps) {
  const { t } = await useTranslation(locale, 'common');
  // Reverted to local data for events
  const events: LocalEventItem[] = [
    {
      id: 'event1',
      titleKey: 'pages.etkinlikler.sample.event1.title',
      summaryKey: 'pages.etkinlikler.sample.event1.summary',
      imageUrl: 'https://placehold.co/600x338.png',
      date: 'November 5, 2023',
      eventUrl: '#',
      imageAiHint: 'community event',
    },
    {
      id: 'event2',
      titleKey: 'pages.etkinlikler.sample.event2.title',
      summaryKey: 'pages.etkinlikler.sample.event2.summary',
      imageUrl: 'https://placehold.co/600x338.png',
      date: 'December 10, 2023',
      eventUrl: '#',
      imageAiHint: 'workshop coding',
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
        <CalendarDays className="mr-2 h-6 w-6 text-primary" />
        {t('navbar.etkinlikler')}
      </h1>
      <p className="text-lg text-muted-foreground">
        {t('pages.etkinlikler.description')}
      </p>

      {events.length === 0 ? (
        <Card className="shadow-lg bg-card">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">{t('pages.etkinlikler.noEvents')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <Link href={event.eventUrl} target="_blank" rel="noopener noreferrer" aria-label={t(event.titleKey)}>
                <div className="relative aspect-video w-full cursor-pointer">
                  <Image
                    src={event.imageUrl}
                    alt={t(event.titleKey)}
                    fill
                    className="object-cover"
                    data-ai-hint={event.imageAiHint || 'community event'}
                  />
                </div>
              </Link>
              <CardHeader>
                <CardTitle className="text-xl">{t(event.titleKey)}</CardTitle>
                <p className="text-xs text-muted-foreground">{event.date}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{t(event.summaryKey)}</p>
                <Link href={event.eventUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                  {t('common.learnMore')}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
