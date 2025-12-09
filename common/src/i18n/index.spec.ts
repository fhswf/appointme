import { describe, it, expect } from '@jest/globals';
import { resources, type ResourceKey, type Language } from './index';
import { en } from './locales/en';
import { de } from './locales/de';

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

        it('should only contain en and de locales', () => {
            const keys = Object.keys(resources);
            expect(keys).toHaveLength(2);
            expect(keys).toContain('en');
            expect(keys).toContain('de');
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
            expect(deKeys).toEqual(enKeys);
        });
    });
});
