import { describe, it, expect } from 'vitest';
import { de } from './de';
import { en } from './en';

describe('German locale (de)', () => {
    it('should export a valid translation object', () => {
        expect(de).toBeDefined();
        expect(typeof de).toBe('object');
    });

    it('should contain required basic translation keys', () => {
        expect(de['these_zesty_duck_nudge']).toBeDefined();
        expect(de['lazy_just_duck_spin']).toBeDefined();
        expect(de['Name']).toBeDefined();
        expect(de['Email']).toBeDefined();
    });

    it('should contain backend-specific translation keys', () => {
        expect(de['invitationSubject']).toBeDefined();
        expect(de['invitationBody']).toBeDefined();
        expect(de['icsDescription']).toBeDefined();
        expect(de['dateFormat']).toBeDefined();
    });

    it('should have valid dateFormat', () => {
        expect(de['dateFormat']).toBe('de-DE');
    });

    it('should have template placeholders in invitation subject', () => {
        expect(de['invitationSubject']).toContain('{{summary}}');
    });

    it('should have template placeholders in invitation body', () => {
        expect(de['invitationBody']).toContain('{{attendeeName}}');
        expect(de['invitationBody']).toContain('{{summary}}');
        expect(de['invitationBody']).toContain('{{description}}');
        expect(de['invitationBody']).toContain('{{time}}');
    });

    it('should have template placeholders in icsDescription', () => {
        expect(de['icsDescription']).toContain('{{description}}');
    });

    it('should contain event-related keys', () => {
        expect(de['Confirm meeting']).toBeDefined();
        expect(de['Daily availability']).toBeDefined();
    });

    it('should not have empty string values', () => {
        const values = Object.values(de);
        values.forEach(value => {
            expect(typeof value).toBe('string');
            expect(value.length).toBeGreaterThan(0);
        });
    });

    it('should have all keys that English locale has', () => {
        const enKeys = Object.keys(en);
        const deKeys = Object.keys(de);

        enKeys.forEach(key => {
            expect(deKeys).toContain(key);
        });
    });

    it('should have German translations (not just English)', () => {
        // Check a few key translations to ensure they're actually in German
        expect(de['Name']).toBe('Name');
        expect(de['Email']).toBe('E-Mail-Adresse');
        expect(de['Save']).toBe('Speichern');
        expect(de['teal_lofty_hawk_peek']).toBe('Abbrechen');
    });
});
