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
});
