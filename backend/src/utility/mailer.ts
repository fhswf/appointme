import { createTransport } from "nodemailer";
import { logger } from "../logging.js";

const smtpUser = process.env.SMTP_USER || process.env.EMAIL_FROM;
const smtpPassword = process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD;

const smtpConfig: any = process.env.SMTP_HOST
    ? {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
    }
    : {
        service: "gmail",
        tls: {
            rejectUnauthorized: true,
        },
        secure: true,
        requireTLS: true,
    };

if (smtpPassword || process.env.SMTP_USER) {
    smtpConfig.auth = {
        user: smtpUser,
        pass: smtpPassword,
    };
}

export const transporter = createTransport(smtpConfig);

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

/**
 * Generic function to send an email
 * @param to Recipient email
 * @param subject Email subject
 * @param html Email body (HTML)
 */
export const sendEmail = (to: string, subject: string, html: string) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.error("Error sending email: %o", error);
                // We resolve with null instead of rejecting to avoid crashing callers
                resolve(null);
            } else {
                logger.debug("Email sent: %o", info);
                resolve(info);
            }
        });
    });
};

/**
 * Verifies the SMTP connection
 */
export const verifyConnection = async () => {
    return new Promise((resolve, reject) => {
        transporter.verify((error, success) => {
            if (error) {
                logger.error("Error verifying SMTP connection: %o", error);
                reject(error);
            } else {
                logger.info("SMTP connection verified");
                resolve(success);
            }
        });
    });
};

