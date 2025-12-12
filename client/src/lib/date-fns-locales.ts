
import { Locale } from 'date-fns';
import {
    de,
    enUS,
    es,
    fr,
    it,
    ja,
    ko,
    zhCN
} from 'date-fns/locale';

export const locales: Record<string, Locale> = {
    de,
    en: enUS,
    es,
    fr,
    it,
    ja,
    ko,
    zh: zhCN
};
