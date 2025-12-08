import crypto from 'crypto';
import { logger } from '../logging.js';

const ALGORITHM = 'aes-256-gcm';
const ENCODING = 'hex';
const IV_LENGTH = 16;
const KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_must_be_32_bytes_long_!!'; // Fallback for dev, should be in env

// Ensure key is 32 bytes
const getKey = () => {
    return crypto.scryptSync(KEY, 'salt', 32);
}

export const encrypt = (text: string): string => {
    if (!text) return text;
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
        let encrypted = cipher.update(text, 'utf8', ENCODING);
        encrypted += cipher.final(ENCODING);
        const authTag = cipher.getAuthTag();
        return `${iv.toString(ENCODING)}:${authTag.toString(ENCODING)}:${encrypted}`;
    } catch (error) {
        logger.error('Encryption failed', error);
        throw new Error('Encryption failed');
    }
};

export const decrypt = (text: string): string => {
    if (!text) return text;
    try {
        const parts = text.split(':');
        // Backwards compatibility for old format (IV:Encrypted) - likely won't work with GCM but good to avoid crash
        // If 2 parts, it might be old CBC data. But GCM will fail without tag.
        // We strict check for 3 parts now.
        if (parts.length !== 3) return text;

        const iv = Buffer.from(parts[0], ENCODING);
        const authTag = Buffer.from(parts[1], ENCODING);
        const encryptedText = parts[2];

        const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedText, ENCODING, 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        logger.error('Decryption failed', error);
        return text;
    }
};
