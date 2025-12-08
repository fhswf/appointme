import { en } from './locales/en.js';
import { de } from './locales/de.js';

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
