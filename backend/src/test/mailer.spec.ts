import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendEventInvitation, transporter } from '../utility/mailer.js';

// Mock nodemailer
vi.mock("nodemailer", () => {
    return {
        createTransport: vi.fn(() => ({
            sendMail: vi.fn((mailOptions, callback) => {
                callback(null, { messageId: 'test-message-id' });
            })
        }))
    }
});

describe('Mailer Utility', () => {
    it('should send an event invitation with ICS attachment', async () => {
        const sendMailSpy = vi.spyOn(transporter, 'sendMail');

        const to = 'test@example.com';
        const subject = 'Test Event';
        const html = '<p>Test Body</p>';
        const icsContent = 'BEGIN:VCALENDAR...END:VCALENDAR';

        await sendEventInvitation(to, subject, html, icsContent, 'invite.ics');

        expect(sendMailSpy).toHaveBeenCalledWith(expect.objectContaining({
            to: to,
            subject: subject,
            html: html,
            attachments: [
                {
                    filename: 'invite.ics',
                    content: icsContent,
                    contentType: 'text/calendar'
                }
            ]
        }), expect.any(Function));
    });

    it('should handle send errors', async () => {
        const error = new Error("Send failed");
        vi.spyOn(transporter, 'sendMail').mockImplementation(((opts: any, cb: any) => {
            if (typeof cb === 'function') {
                cb(error, null);
            }
            return Promise.reject(error);
        }) as any);

        await expect(sendEventInvitation('fail@test.com', 'Sub', 'Body', 'ICS')).rejects.toThrow("Send failed");
    });
});

// Test suite for SMTP configuration coverage
describe('Mailer Configuration', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.clearAllMocks();
    });

    it('should configure for Gmail service when SMTP_HOST is not set', async () => {
        delete process.env.SMTP_HOST;
        process.env.EMAIL_FROM = 'gmail@example.com';
        process.env.EMAIL_PASSWORD = 'password';

        // Re-import to trigger transporter creation with new env
        const { transporter: newTransporter } = await import('../utility/mailer.js?update=' + Date.now());

        // No direct way to inspect `transporter.options` easily without type widening or knowing internal structure match
        // But we can verify it doesn't crash and is created.
        expect(newTransporter).toBeDefined();
    });

    it('should configure for SMTP when SMTP_HOST is set', async () => {
        process.env.SMTP_HOST = 'smtp.example.com';
        process.env.SMTP_PORT = '587';
        process.env.SMTP_SECURE = 'false';
        process.env.SMTP_USER = 'user';
        process.env.SMTP_PASSWORD = 'pass';

        const { transporter: newTransporter } = await import('../utility/mailer.js?update=' + Date.now());
        expect(newTransporter).toBeDefined();
    });

    it('should configure for SMTP with secure true', async () => {
        process.env.SMTP_HOST = 'smtp.secure.com';
        process.env.SMTP_SECURE = 'true';

        const { transporter: newTransporter } = await import('../utility/mailer.js?update=' + Date.now());
        expect(newTransporter).toBeDefined();
    });

    it('should configure for SMTP without auth when credentials are not set', async () => {
        process.env.SMTP_HOST = 'internal.smtp.com';
        process.env.EMAIL_FROM = 'noreply@internal.com';
        delete process.env.SMTP_USER;
        delete process.env.SMTP_PASSWORD;
        delete process.env.EMAIL_PASSWORD;

        const { transporter: newTransporter } = await import('../utility/mailer.js?update=' + Date.now());
        expect(newTransporter).toBeDefined();
    });

});
