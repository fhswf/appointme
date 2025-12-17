import { describe, it, expect } from 'vitest';
import { getLocale } from './date_locales';
import { de, enUS, fr, es, it as itLocale, ja, ko, zhCN } from "date-fns/locale";

describe('date_locales', () => {
    describe('getLocale', () => {
        it('should return German locale for "de"', () => {
            expect(getLocale('de')).toBe(de);
        });

        it('should return French locale for "fr"', () => {
            expect(getLocale('fr')).toBe(fr);
        });

        it('should return Spanish locale for "es"', () => {
            expect(getLocale('es')).toBe(es);
        });

        it('should return Italian locale for "it"', () => {
            expect(getLocale('it')).toBe(itLocale);
        });

        it('should return Japanese locale for "ja"', () => {
            expect(getLocale('ja')).toBe(ja);
        });

        it('should return Korean locale for "ko"', () => {
            expect(getLocale('ko')).toBe(ko);
        });

        it('should return Chinese locale for "zh"', () => {
            expect(getLocale('zh')).toBe(zhCN);
        });

        it('should return US English locale for unknown language', () => {
            expect(getLocale('unknown')).toBe(enUS);
        });

        it('should return US English locale for empty string', () => {
            expect(getLocale('')).toBe(enUS);
        });
    });
});
