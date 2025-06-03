import { createInstance, type Namespace } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { getOptions, defaultNS } from './settings';

const initI18next = async (lng: string, ns: Namespace) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`../../../public/locales/${language}/${namespace}.json`)))
    .init(getOptions(lng, ns));
  return i18nInstance;
};

export async function useTranslation(lng: string, ns: Namespace = defaultNS, options: { keyPrefix?: string } = {}) {
  const i18nextInstance = await initI18next(lng, ns);
  // getFixedT can handle ns as a string or string[] correctly for determining the default namespace for the t function.
  return {
    t: i18nextInstance.getFixedT(lng, ns, options.keyPrefix),
    i18n: i18nextInstance,
  };
}

// Re-export settings for convenience
export { fallbackLng, languages, defaultNS, cookieName } from './settings';
