import { describe, it, expect } from 'vitest';
import { en } from './en';

describe('English locale (en)', () => {
    it('should export a valid translation object', () => {
        expect(en).toBeDefined();
        expect(typeof en).toBe('object');
    });

    it('should contain required basic translation keys', () => {
        expect(en['these_zesty_duck_nudge']).toBeDefined();
        expect(en['lazy_just_duck_spin']).toBeDefined();
        expect(en['Name']).toBeDefined();
        expect(en['Email']).toBeDefined();
    });

    it('should contain backend-specific translation keys', () => {
        expect(en['invitationSubject']).toBeDefined();
        expect(en['invitationBody']).toBeDefined();
        expect(en['icsDescription']).toBeDefined();
        expect(en['dateFormat']).toBeDefined();
    });

    it('should have valid dateFormat', () => {
        expect(en['dateFormat']).toBe('en-US');
    });

    it('should have template placeholders in invitation subject', () => {
        expect(en['invitationSubject']).toContain('{{summary}}');
    });

    it('should have template placeholders in invitation body', () => {
        expect(en['invitationBody']).toContain('{{attendeeName}}');
        expect(en['invitationBody']).toContain('{{summary}}');
        expect(en['invitationBody']).toContain('{{description}}');
        expect(en['invitationBody']).toContain('{{time}}');
    });

    it('should have template placeholders in icsDescription', () => {
        expect(en['icsDescription']).toContain('{{description}}');
    });

    it('should contain event-related keys', () => {
        expect(en['Confirm meeting']).toBeDefined();
        expect(en['Daily availability']).toBeDefined();
        expect(en['Schedule an appointment']).toBeDefined();
    });

    it('should contain form-related keys', () => {
        expect(en['Choose date']).toBeDefined();
        expect(en['Choose time']).toBeDefined();
        expect(en['Provide details']).toBeDefined();
        expect(en['Confirmation']).toBeDefined();
    });

    it('should not have empty string values', () => {
        const values = Object.values(en);
        values.forEach(value => {
            expect(typeof value).toBe('string');
            expect(value.length).toBeGreaterThan(0);
        });
    });
});
