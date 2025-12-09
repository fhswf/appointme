import { describe, it, expect } from '@jest/globals';
import { resources, type ResourceKey, type Language } from './index';
import { en } from './locales/en';
import { de } from './locales/de';
import { fr } from './locales/fr';
import { es } from './locales/es';
import { it as itLocale } from './locales/it';
import { zh } from './locales/zh';
import { ko } from './locales/ko';
import { ja } from './locales/ja';

describe('i18n index', () => {
    describe('resources export', () => {
        it('should export resources object', () => {
            expect(resources).toBeDefined();
            expect(typeof resources).toBe('object');
        });

        it('should contain English locale', () => {
            expect(resources.en).toBeDefined();
            expect(resources.en.translation).toBeDefined();
        });

        it('should contain German locale', () => {
            expect(resources.de).toBeDefined();
            expect(resources.de.translation).toBeDefined();
        });

        it('should have correct structure for English', () => {
            expect(resources.en.translation).toEqual(en);
        });

        it('should have correct structure for German', () => {
            expect(resources.de.translation).toEqual(de);
        });

        it('should contain all supported locales', () => {
            const keys = Object.keys(resources);
            expect(keys).toHaveLength(8);
            expect(keys).toContain('en');
            expect(keys).toContain('de');
            expect(keys).toContain('fr');
            expect(keys).toContain('es');
            expect(keys).toContain('it');
            expect(keys).toContain('zh');
            expect(keys).toContain('ko');
            expect(keys).toContain('ja');
        });
    });

    describe('TypeScript types', () => {
        it('should allow valid ResourceKey values', () => {
            // This is a compile-time check, but we can verify runtime behavior
            const validKey: ResourceKey = 'Name';
            expect(en[validKey]).toBeDefined();
        });

        it('should allow valid Language values', () => {
            // This is a compile-time check, but we can verify runtime behavior
            const validLang: Language = 'en';
            expect(resources[validLang]).toBeDefined();
        });

        it('should have ResourceKey type matching en keys', () => {
            // Verify that all keys in en are valid ResourceKeys
            const enKeys = Object.keys(en) as ResourceKey[];
            enKeys.forEach(key => {
                expect(en[key]).toBeDefined();
            });
        });
    });

    describe('locale consistency', () => {
        it('should have same number of keys in both locales', () => {
            const enKeys = Object.keys(en);
            const deKeys = Object.keys(de);
            expect(deKeys.length).toBe(enKeys.length);
        });

        it('should have matching keys between locales', () => {
            const enKeys = Object.keys(en).sort();
            const deKeys = Object.keys(de).sort();
            const frKeys = Object.keys(fr).sort();
            const esKeys = Object.keys(es).sort();
            const itKeys = Object.keys(itLocale).sort();
            const zhKeys = Object.keys(zh).sort();
            const koKeys = Object.keys(ko).sort();
            const jaKeys = Object.keys(ja).sort();

            expect(deKeys).toEqual(enKeys);
            expect(frKeys).toEqual(enKeys);
            expect(esKeys).toEqual(enKeys);
            expect(itKeys).toEqual(enKeys);
            expect(zhKeys).toEqual(enKeys);
            expect(koKeys).toEqual(enKeys);
            expect(jaKeys).toEqual(enKeys);
        });
    });
});
