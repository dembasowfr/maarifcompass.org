
import { useTranslation } from '@/lib/i18n';
// Removed: import { getAnnouncements, type Announcement } from '@/lib/firebase/firestoreService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

interface DuyurularPageProps {
  params: {
    locale: string;
  };
}

// Define a type for local announcements
interface LocalAnnouncement {
  id: string;
  titleKey: string;
  detailKey: string;
  imageUrl: string;
  date: string; // Keep as string for local data simplicity
  imageAiHint?: string;
}

export async function generateMetadata({ params: { locale } }: DuyurularPageProps): Promise<Metadata> {
  const { t } = await useTranslation(locale, 'common');
  return {
    title: `${t('navbar.duyurular')} | ${t('appName')}`,
    description: t('pages.duyurular.description'),
  };
}

export default async function DuyurularPage({ params: { locale } }: DuyurularPageProps) {
  const { t } = await useTranslation(locale, 'common');
  // Reverted to local data for announcements
  const announcements: LocalAnnouncement[] = [
    {
      id: 'announcement1',
      titleKey: 'pages.duyurular.sample.announcement1.title',
      detailKey: 'pages.duyurular.sample.announcement1.detail',
      imageUrl: 'https://placehold.co/600x338.png',
      date: 'October 25, 2023',
      imageAiHint: 'important notice',
    },
    {
      id: 'announcement2',
      titleKey: 'pages.duyurular.sample.announcement2.title',
      detailKey: 'pages.duyurular.sample.announcement2.detail',
      imageUrl: 'https://placehold.co/600x338.png',
      date: 'November 1, 2023',
      imageAiHint: 'deadline reminder',
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
        <Megaphone className="mr-2 h-6 w-6 text-primary" />
        {t('navbar.duyurular')}
      </h1>
       <p className="text-lg text-muted-foreground">
        {t('pages.duyurular.description')}
      </p>

      {announcements.length === 0 ? (
        <Card className="shadow-lg bg-card">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">{t('pages.duyurular.noAnnouncements')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-4">
          {announcements.map((item) => (
            <Card key={item.id} className="shadow-md overflow-hidden">
              <div className="relative aspect-video w-full">
                <Image
                  src={item.imageUrl}
                  alt={t(item.titleKey)}
                  fill
                  className="object-cover"
                  data-ai-hint={item.imageAiHint || 'important notice'}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{t(item.titleKey)}</CardTitle>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t(item.detailKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
