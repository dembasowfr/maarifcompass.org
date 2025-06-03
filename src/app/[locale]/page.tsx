
import { useTranslation } from '@/lib/i18n';
// Removed: import { getHomepageServices, type HomepageService } from '@/lib/firebase/firestoreService';
import DynamicIcon from '@/components/DynamicIcon';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface HomePageProps {
  params: {
    locale: string;
  };
}

// Define a type for local services if it's different from Firestore's HomepageService
interface LocalHomepageService {
  id: string;
  titleKey: string; // Use translation keys
  descriptionKey: string; // Use translation keys
  iconName: string;
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = params.locale; // Access params.locale here
  const { t } = await useTranslation(locale, 'common');
  // Reverted to local data for services
  const services: LocalHomepageService[] = [
    {
      id: 'service1',
      titleKey: 'homepage.services.item1.title',
      descriptionKey: 'homepage.services.item1.description',
      iconName: 'BookOpen',
    },
    {
      id: 'service2',
      titleKey: 'homepage.services.item2.title',
      descriptionKey: 'homepage.services.item2.description',
      iconName: 'Briefcase',
    },
    {
      id: 'service3',
      titleKey: 'homepage.services.item3.title',
      descriptionKey: 'homepage.services.item3.description',
      iconName: 'Users',
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-16 md:space-y-24 py-8">
      {/* Hero Section */}
      <section className="w-full text-center max-w-5xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
          {t('hero.title')}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
          {t('hero.subtitle')}
        </p>
        <div className="mb-12 relative aspect-video max-w-3xl mx-auto">
          <Image 
            src="https://placehold.co/1200x675.png" 
            alt={t('hero.title')} 
            fill
            className="rounded-lg shadow-xl object-cover"
            data-ai-hint="students collaboration"
            priority
          />
        </div>
        <Link href={`/${locale}/about`}>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-md text-lg group">
            {t('hero.cta')}
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </section>

      {/* Services Section */}
      <section className="w-full max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight text-center text-foreground mb-12">
          {t('homepage.services.title')}
        </h2>
        {services.length === 0 ? (
          <p className="text-muted-foreground text-center">{t('homepage.services.noServices')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
                <CardHeader className="items-center">
                  <DynamicIcon name={service.iconName} className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>{t(service.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t(service.descriptionKey)}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Impact Section */}
      <section className="w-full max-w-5xl mx-auto px-4 text-center bg-muted/30 py-12 md:py-16 rounded-lg shadow">
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">
          {t('homepage.impact.title')}
        </h2>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
          {t('homepage.impact.content')}
        </p>
        <div className="relative aspect-video max-w-2xl mx-auto">
          <Image
            src="https://placehold.co/1000x563.png"
            alt={t('homepage.impact.title')}
            fill
            className="rounded-lg shadow-xl object-cover"
            data-ai-hint="community success group"
          />
        </div>
      </section>

      {/* Get Involved CTA Section */}
      <section className="w-full max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">
          {t('homepage.getInvolved.title')}
        </h2>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
          {t('homepage.getInvolved.content')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href={`/${locale}/contact`}>
            <Button size="lg" variant="default" className="w-full sm:w-auto">
              {t('homepage.getInvolved.contactButton')}
            </Button>
          </Link>
          <Link href={`/${locale}/document-center`}>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              {t('homepage.getInvolved.documentsButton')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
