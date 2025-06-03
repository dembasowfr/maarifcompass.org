import { useTranslation } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

interface PrivacyPolicyPageProps {
  params: {
    locale: string;
  };
}

export default async function PrivacyPolicyPage({ params: { locale } }: PrivacyPolicyPageProps) {
  const { t } = await useTranslation(locale, 'common');

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('footer.privacyPolicy')}</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="mr-2 h-6 w-6 text-primary" />
            {t('footer.privacyPolicy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our Privacy Policy details how we handle your data.
            Content coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
