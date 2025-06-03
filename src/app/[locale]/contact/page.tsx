// src/app/[locale]/contact/page.tsx

import type { Metadata } from 'next';
import { useTranslation as useServerTranslation } from '@/lib/i18n';
import ContactFormClient from '@/components/contact/ContactFormClient';

interface ContactPageProps {
  params: {
    locale: string;
  };
}

// CORRECTED: Await params before destructuring in generateMetadata
export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params; // <--- THIS LINE IS ADDED, AND 'params' IS NOW PASSED INTACT TO THE FUNCTION
  
  const { t } = await useServerTranslation(locale, 'contact-form');
  const { t: tCommon } = await useServerTranslation(locale, 'common');
  return {
    title: `${t('title')} | ${tCommon('appName')}`,
    description: t('description'),
  };
}

// CORRECTED: Await params before destructuring in ContactPage component
export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params; // <--- THIS LINE IS ADDED, AND 'params' IS NOW PASSED INTACT TO THE FUNCTION
  
  return <ContactFormClient locale={locale} />;
}