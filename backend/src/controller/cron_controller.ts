
import { Request, Response } from 'express';
import { UserModel } from '../models/User.js';
import { getAuth } from './google_controller.js';
import { logger } from '../logging.js';
import { transporter, verifyConnection } from '../utility/mailer.js';

/**
 * Validates Google Calendar tokens for all users.
 * Triggered via K8s CronJob.
 */
export const validateGoogleTokens = async (req: Request, res: Response) => {
    // Security check
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.ADMIN_API_KEY) {
        logger.warn('Unauthorized attempt to access cron route');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    logger.info('Starting daily token validation job');

    // Check SMTP connection
    let smtpStatus = false;
    try {
        await verifyConnection();
        smtpStatus = true;
    } catch (e) {
        logger.error('SMTP connection check failed: %o', e);
    }

    const users = await UserModel.find({ 'google_tokens.access_token': { $exists: true } }).exec();

    const stats = {
        total: users.length,
        valid: 0,
        invalid: 0,
        errors: 0,
        smtp: smtpStatus
    };

    for (const user of users) {
        try {
            await getAuth(user._id as string);
            // If getAuth succeeds, token is likely valid (or at least parsable). 
            // Ideally we should make a lightweight call to ensure it works.
            // But getAuth just sets credentials. To really test, we might need a dummy call.
            // However, getAuth just builds the client. It doesn't validate.
            // Let's use a lightweight call like `calendarList.list`.

            // Re-importing google to use with the client
            const { google } = await import('googleapis');
            const auth = await getAuth(user._id as string);
            const calendar = google.calendar({ version: "v3", auth });

            await calendar.calendarList.list({ maxResults: 1 }); // Lightweight call

            stats.valid++;

            if (user.auth_check_notification) {
                await sendEmail(user.email, 'AppointMe: Calendar Connection OK',
                    `<p>Hello ${user.given_name || 'User'},</p><p>Your Google Calendar connection is active and working correctly.</p>`);
            }

        } catch (err: any) {
            const isInvalid = err.message === 'invalid_grant' ||
                err.response?.data?.error === 'invalid_grant' ||
                err.code === 400 ||
                err.code === 401;

            if (isInvalid) {
                stats.invalid++;
                logger.warn(`Token invalid for user ${user._id}`);
                await sendEmail(user.email, 'AppointMe: Action Required - Calendar Connection Failed',
                    `<p>Hello ${user.given_name || 'User'},</p>
                     <p>We are unable to access your Google Calendar. Your connection has expired or was revoked.</p>
                     <p><strong>Please log in to AppointMe and reconnect your calendar to ensure appointments can be booked.</strong></p>`);
            } else {
                stats.errors++;
                logger.error(`Error validating user ${user._id}: ${err.message}`);
            }
        }
    }

    logger.info('Token validation job finished: %o', stats);
    res.json(stats);
};

// Start of helper to use nodemailer directly since sendEventInvitation wraps ICS.

const sendEmail = (to: string, subject: string, html: string) => {
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
                // Don't reject, just log, so loop continues
                resolve(null);
            } else {
                resolve(info);
            }
        });
    });
};

import { AppointmentModel } from '../models/Appointment.js';
import { syncAppointment } from '../services/sync_service.js';

export const reconcileAppointments = async (req: Request, res: Response) => {
    // Security check
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.ADMIN_API_KEY) {
        logger.warn('Unauthorized attempt to access reconcile route');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    logger.info("Starting appointment reconciliation job via cron route");

    try {
        // 1. Process pending and failed appointments
        const pendingAppointments = await AppointmentModel.find({
            status: { $in: ['pending', 'failed'] }
        }).exec();

        logger.info(`Found ${pendingAppointments.length} pending/failed appointments`);

        const results = {
            total: pendingAppointments.length,
            success: 0,
            failed: 0
        };

        for (const app of pendingAppointments) {
            logger.info(`Syncing appointment ${app._id} (status: ${app.status})...`);
            try {
                const success = await syncAppointment(app._id.toString());
                if (success) {
                    results.success++;
                } else {
                    results.failed++;
                }
            } catch (err) {
                logger.error(`Error processing appointment ${app._id}`, err);
                results.failed++;
            }
        }

        res.json(results);

    } catch (err) {
        logger.error("Reconciliation job failed", err);
        res.status(500).json({ error: err });
    }
};
