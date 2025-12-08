import { resources, ResourceKey, Language } from 'common';

export type Locale = Language;

export const getLocale = (acceptLanguage: string | undefined): Locale => {
    if (!acceptLanguage) return 'en';
    if (acceptLanguage.startsWith('de')) return 'de';
    return 'en';
};

export const t = (locale: Locale, key: ResourceKey, params: Record<string, string> = {}): string => {
    let text = resources[locale].translation[key];
    if (!text) return key; // Fallback to key if not found
    for (const [param, value] of Object.entries(params)) {
        text = text.replace(`{{${param}}}`, value); // Common uses double braces
    }
    return text;
};
