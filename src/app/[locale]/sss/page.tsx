import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import type { Metadata } from 'next';

interface SSSPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params: { locale } }: SSSPageProps): Promise<Metadata> {
  const { t } = await useTranslation(locale, 'common');
  return {
    title: `${t('navbar.sss')} | ${t('appName')}`,
    description: t('pages.faq.description'),
  };
}

export default async function SSSPage({ params: { locale } }: SSSPageProps) {
  const { t } = await useTranslation(locale, 'common');

  return (
    <div className="space-y-8">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center justify-center md:justify-start">
          <HelpCircle className="mr-3 h-7 w-7 text-primary" />
          {t('navbar.sss')}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('pages.faq.description')}
        </p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{t('pages.faq.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('common.contentComingSoon', { ns: 'common' })}
          </p>
          {/* FAQ items will go here, possibly using an Accordion component */}
        </CardContent>
      </Card>
    </div>
  );
}
