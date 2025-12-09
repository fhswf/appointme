import { en } from './locales/en.js';
import { de } from './locales/de.js';
import { fr } from './locales/fr.js';
import { es } from './locales/es.js';
import { it } from './locales/it.js';
import { zh } from './locales/zh.js';
import { ko } from './locales/ko.js';
import { ja } from './locales/ja.js';

export const resources = {
    en: {
        translation: en
    },
    de: {
        translation: de
    },
    fr: {
        translation: fr
    },
    es: {
        translation: es
    },
    it: {
        translation: it
    },
    zh: {
        translation: zh
    },
    ko: {
        translation: ko
    },
    ja: {
        translation: ja
    }
};

export type ResourceKey = keyof typeof en;
export type Language = keyof typeof resources;
