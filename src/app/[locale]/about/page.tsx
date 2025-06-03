import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Target, Eye, CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

interface AboutPageProps {
  params: {
    locale: string;
  };
}

// It's good practice to define metadata for each page
export async function generateMetadata({ params: { locale } }: AboutPageProps): Promise<Metadata> {
  const { t } = await useTranslation(locale, 'common');
  return {
    title: `${t('navbar.about')} | ${t('appName')}`, // Use navbar.about for consistency
    description: t('aboutPage.introduction'),
  };
}

export default async function AboutPage({ params: { locale } }: AboutPageProps) {
  const { t } = await useTranslation(locale, 'common');

  return (
    <div className="space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {t('navbar.about')} {/* Use navbar.about for consistency */}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t('aboutPage.mainHeading')}
        </p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Building className="mr-3 h-7 w-7 text-primary" />
            {t('navbar.about')} {/* Use navbar.about for consistency */}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>{t('aboutPage.introduction')}</p>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Target className="mr-2 h-6 w-6 text-primary" />
              {t('aboutPage.mission.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('aboutPage.mission.content')}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Eye className="mr-2 h-6 w-6 text-primary" />
              {t('aboutPage.vision.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('aboutPage.vision.content')}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <CheckCircle className="mr-3 h-7 w-7 text-primary" />
            {t('aboutPage.whatWeOffer.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>{t('aboutPage.whatWeOffer.item1')}</li>
            <li>{t('aboutPage.whatWeOffer.item2')}</li>
            <li>{t('aboutPage.whatWeOffer.item3')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
