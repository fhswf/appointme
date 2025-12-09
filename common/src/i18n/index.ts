import { en } from './locales/en';
import { de } from './locales/de';

export const resources = {
    en: {
        translation: en
    },
    de: {
        translation: de
    }
};

export type ResourceKey = keyof typeof en;
export type Language = keyof typeof resources;
