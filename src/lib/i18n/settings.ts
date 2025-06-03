import type { InitOptions, Namespace } from 'i18next';

export const fallbackLng = 'en';
export const languages = [fallbackLng, 'tr'];
// defaultNS is the namespace(s) to be loaded by default or used by t() if not specified.
// It can be a string or an array of strings. For simplicity, we'll use a string here.
export const defaultNS: string = 'common';
export const cookieName = 'i18next';

export function getOptions(lng: string = fallbackLng, ns: Namespace = defaultNS): InitOptions {
  return {
    // debug: true, // Set to true for debugging
    supportedLngs: languages,
    fallbackLng,
    lng,
    ns, // Namespaces to load
    defaultNS: defaultNS, // Default namespace for t function. i18next uses the first one if ns is an array.
    fallbackNS: defaultNS, // Fallback namespace to use.
  };
}
