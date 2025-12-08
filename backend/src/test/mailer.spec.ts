import { describe, it, expect, vi } from 'vitest';
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
        vi.spyOn(transporter, 'sendMail').mockImplementation((opts, cb) => {
            // @ts-ignore
            cb(error, null);
        });

        await expect(sendEventInvitation('fail@test.com', 'Sub', 'Body', 'ICS')).rejects.toThrow("Send failed");
    });
});
