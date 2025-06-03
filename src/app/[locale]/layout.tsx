import type { ReactNode } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { languages, fallbackLng } from '@/lib/i18n/settings';
import { dir } from 'i18next';
import { AuthProvider } from '@/contexts/AuthContext';

export async function generateStaticParams() {
  return languages.map((lng) => ({ locale: lng }));
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

// ✅ Make this async and await params
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await Promise.resolve(params); // Satisfies async requirement

  const currentLocale = languages.includes(locale) ? locale : fallbackLng;

  return (
    <AuthProvider>
      <div lang={currentLocale} dir={dir(currentLocale)} className="flex flex-col min-h-screen">
        <Navbar lng={currentLocale} />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer lng={currentLocale} />
      </div>
    </AuthProvider>
  );
}
