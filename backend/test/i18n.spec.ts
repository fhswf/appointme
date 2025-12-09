import { getLocale, t } from '../src/utility/i18n';
import { describe, it, expect } from '@jest/globals';

describe('i18n', () => {
    it('should default to en if no accept-language header', () => {
        expect(getLocale(undefined)).toBe('en');
    });

    it('should detect de locale', () => {
        expect(getLocale('de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7')).toBe('de');
        expect(getLocale('de')).toBe('de');
    });

    it('should default to en for other locales', () => {
        expect(getLocale('fr-FR')).toBe('en');
    });

    it('should translate simplified keys', () => {
        expect(t('en', 'invitationSubject', { summary: 'Meeting' })).toBe('Invitation: Meeting');
        expect(t('de', 'invitationSubject', { summary: 'Meeting' })).toBe('Einladung: Meeting');
    });

    it('should replace parameters correctly', () => {
        const enBody = t('en', 'invitationBody', {
            attendeeName: 'John',
            summary: 'Meeting',
            description: 'Discuss things',
            time: '12:00'
        });
        expect(enBody).toContain('Hi John');
        expect(enBody).toContain('Meeting');
        expect(enBody).toContain('Discuss things');

        const deBody = t('de', 'invitationBody', {
            attendeeName: 'Hans',
            summary: 'Treffen',
            description: 'Dinge besprechen',
            time: '12:00'
        });
        expect(deBody).toContain('Hallo Hans');
        expect(deBody).toContain('Treffen');
        expect(deBody).toContain('Dinge besprechen');
    });

    it('should return key if translation not found', () => {
        const result = t('en', 'nonExistentKey' as any);
        expect(result).toBe('nonExistentKey');
    });

    it('should handle empty parameters', () => {
        const result = t('en', 'invitationSubject', {});
        expect(result).toContain('Invitation');
    });

    it('should handle multiple parameter replacements', () => {
        const result = t('en', 'invitationBody', {
            attendeeName: 'Alice',
            summary: 'Team Sync',
            description: 'Weekly sync',
            time: '14:00'
        });
        expect(result).toContain('Alice');
        expect(result).toContain('Team Sync');
        expect(result).toContain('Weekly sync');
        expect(result).toContain('14:00');
    });

    it('should detect locale from complex accept-language header', () => {
        expect(getLocale('en-US,en;q=0.9')).toBe('en');
        expect(getLocale('de-CH,de;q=0.9,en;q=0.8')).toBe('de');
    });

    it('should handle locale with region code', () => {
        expect(getLocale('de-AT')).toBe('de');
        expect(getLocale('de-CH')).toBe('de');
    });
});

