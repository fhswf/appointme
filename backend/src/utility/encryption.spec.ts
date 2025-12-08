
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { encrypt, decrypt } from './encryption';
import crypto from 'crypto';

describe('Encryption Utility', () => {
    const TEST_TEXT = 'secret message';

    // We need to mock process.env for consistent testing involves keys if needed, 
    // but the module uses a default or env var at load time.
    // Since the module is already loaded, we might strictly test the exported functions behavior.

    it('should encrypt a string', () => {
        const encrypted = encrypt(TEST_TEXT);
        expect(encrypted).not.toBe(TEST_TEXT);
        expect(encrypted).toContain(':');
        const parts = encrypted.split(':');
        expect(parts).toHaveLength(3);
    });

    it('should decrypt an encrypted string', () => {
        const encrypted = encrypt(TEST_TEXT);
        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(TEST_TEXT);
    });

    it('should return empty string/null if input is empty', () => {
        expect(encrypt('')).toBe('');
        // @ts-ignore
        expect(encrypt(null)).toBe(null);
        expect(decrypt('')).toBe('');
        // @ts-ignore
        expect(decrypt(null)).toBe(null);
    });

    it('should return original text if format is invalid (not containing : twice)', () => {
        const invalid = 'notencrypted';
        expect(decrypt(invalid)).toBe(invalid);
    });

    it('should return original text if decryption fails (e.g. invalid IV)', () => {
        const invalid = 'invalidiv:invalidtag:encryptedtext';
        // This relies on the crypto module throwing an error which is caught
        const result = decrypt(invalid);
        expect(result).toBe(invalid);
    });

    it('should handle special characters', () => {
        const special = '!@#$%^&*()_+{}|:"<>?~`[]\;\',./';
        const encrypted = encrypt(special);
        expect(decrypt(encrypted)).toBe(special);
    });
});
