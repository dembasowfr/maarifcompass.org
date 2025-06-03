import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileBadge } from 'lucide-react'; // Changed icon
import type { Metadata } from 'next';

interface DataProtectionPolicyPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params: { locale } }: DataProtectionPolicyPageProps): Promise<Metadata> {
  const { t } = await useTranslation(locale, 'common');
  return {
    title: `${t('footer.links.dataProtectionPolicy')} | ${t('appName')}`,
    description: t('footer.dataProtectionPolicyPageTitle'), // Add a specific description key if needed
  };
}

export default async function DataProtectionPolicyPage({ params: { locale } }: DataProtectionPolicyPageProps) {
  const { t } = await useTranslation(locale, 'common');

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('footer.links.dataProtectionPolicy')}</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileBadge className="mr-2 h-6 w-6 text-primary" />
            {t('footer.links.dataProtectionPolicy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our Data Protection Policy.
            Content coming soon.
          </p>
          {/* Detailed policy text will go here */}
        </CardContent>
      </Card>
    </div>
  );
}