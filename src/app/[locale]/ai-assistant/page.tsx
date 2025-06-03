import type { Metadata } from 'next';
import { useTranslation as useServerTranslation } from '@/lib/i18n';
import AiAssistantClientContainer from '@/components/ai/AiAssistantClientContainer';

interface AiAssistantPageProps {
  params: {
    locale: string;
  };
}

export default async function AiAssistantPage(props: AiAssistantPageProps) {
  const { params } = await props;
  const { locale } = params;

  return (
    <div className="flex flex-col flex-grow h-[60vh] overflow-hidden bg-background"> {/* Adjusted height to 60vh */}
      <AiAssistantClientContainer locale={locale} />
    </div>
  );
}

export async function generateMetadata(props: AiAssistantPageProps): Promise<Metadata> {
  const { params } = await props;
  const { locale } = params;
  const { t } = await useServerTranslation(locale, 'common');

  return {
    title: `${t('navbar.aiAssistant')} | ${t('appName')}`,
    description: t('pages.aiAssistant.description'),
  };
}
