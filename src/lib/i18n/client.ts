
'use client';

import i18next, { FlatNamespace, KeyPrefix, TFunction } from 'i18next';
import { initReactI18next, useTranslation as useTranslationOrg, UseTranslationOptions } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getOptions, languages, cookieName, defaultNS, fallbackLng } from './settings';
import type { Namespace } from 'i18next';
import { useEffect, useMemo, useState } from 'react';

const runsOnServerSide = typeof window === 'undefined';

// Initialize i18next only once
if (!i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(resourcesToBackend((language: string, namespace: string) => import(`../../../public/locales/${language}/${namespace}.json`)))
    .init({
      ...getOptions(), // Uses fallbackLng if no lng is passed initially
      lng: undefined, // Let detector or explicit changeLanguage determine it
      detection: {
        order: ['path', 'htmlTag', 'cookie', 'navigator'],
        caches: ['cookie'],
        cookieMinutes: 60 * 24 * 30,
        cookieName: cookieName,
      },
      preload: runsOnServerSide ? languages : []
    });
}

export function useTranslation<
  N extends Namespace = FlatNamespace,
  TKPrefix extends KeyPrefix<N> = undefined
>(
  lngFromProp?: string,
  ns?: N | Readonly<N>,
  options?: UseTranslationOptions<TKPrefix>,
): { t: TFunction<N, TKPrefix>; i18n: typeof i18next } {
  const { t: originalT, i18n: i18nInstance } = useTranslationOrg(ns || defaultNS, options);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (lngFromProp && i18nInstance.resolvedLanguage !== lngFromProp) {
      i18nInstance.changeLanguage(lngFromProp);
    }
  }, [lngFromProp, i18nInstance, i18nInstance.resolvedLanguage]);

  const t = useMemo(() => {
    // On the server, or if lngFromProp is not provided, or if not mounted yet on client,
    // rely on originalT or a t function based on lngFromProp if language mismatches.
    if (runsOnServerSide || !isMounted || !lngFromProp) {
      if (lngFromProp && i18nInstance.isInitialized && i18nInstance.language !== lngFromProp) {
        return i18nInstance.getFixedT(lngFromProp, ns || defaultNS, options?.keyPrefix);
      }
      return originalT;
    }

    // On the client and mounted:
    // If lngFromProp is provided and the i18n instance is initialized,
    // prioritize getFixedT to ensure consistency with the prop.
    if (i18nInstance.isInitialized) {
        // Always use getFixedT if lngFromProp is available to ensure it reflects the prop
        return i18nInstance.getFixedT(lngFromProp, ns || defaultNS, options?.keyPrefix);
    }
    
    // Fallback to originalT if not initialized (should ideally not happen here)
    return originalT;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lngFromProp, ns, options?.keyPrefix, i18nInstance, originalT, i18nInstance.language, i18nInstance.isInitialized, isMounted]);

  return { t, i18n: i18nInstance };
}

// Helper to get the effective language
export function getCurrentLanguage() {
  return i18next.resolvedLanguage || fallbackLng;
}
