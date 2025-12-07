import { createTransport } from "nodemailer";
import { logger } from "../logging.js";

export const transporter = createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: true,
    },
    secure: true,
    requireTLS: true,
});

/**
 * Sends an email with an ICS attachment
 * @param to Recipient email
 * @param subject Email subject
 * @param html Email body (HTML)
 * @param icsContent The content of the ICS file
 * @param filename Name of the attachment (default: invite.ics)
 */
export const sendEventInvitation = (to: string, subject: string, html: string, icsContent: string, filename = 'invite.ics') => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        html: html,
        attachments: [
            {
                filename: filename,
                content: icsContent,
                contentType: 'text/calendar'
            }
        ]
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.error("Error sending event invitation: %o", error);
                reject(error);
            } else {
                logger.info("Event invitation sent: %o", info);
                resolve(info);
            }
        });
    });
};
