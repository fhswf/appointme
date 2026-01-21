
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateGoogleTokens } from '../controller/cron_controller.js';
import { UserModel } from '../models/User.js';
import { getAuth } from '../controller/google_controller.js';
import { transporter } from '../utility/mailer.js';
import { logger } from '../logging.js';

// Mock dependencies
vi.mock('../models/User.js', () => ({
    UserModel: {
        find: vi.fn()
    }
}));

vi.mock('../controller/google_controller.js', () => ({
    getAuth: vi.fn()
}));

vi.mock('../utility/mailer.js', () => ({
    transporter: {
        sendMail: vi.fn()
    },
    verifyConnection: vi.fn().mockResolvedValue(true)
}));

vi.mock('../logging.js', () => ({
    logger: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    }
}));

// Mock googleapis
const mockCalendarListList = vi.fn();
vi.mock('googleapis', () => ({
    google: {
        calendar: vi.fn(() => ({
            calendarList: {
                list: mockCalendarListList
            }
        }))
    }
}));

describe('Cron Controller - validateGoogleTokens', () => {
    let req: any;
    let res: any;

    beforeEach(() => {
        process.env.ADMIN_API_KEY = 'test_secret';
        process.env.EMAIL_FROM = 'test@example.com';

        req = {
            headers: {
                'x-api-key': 'test_secret'
            }
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should return 401 if x-api-key is missing or invalid', async () => {
        req.headers['x-api-key'] = 'wrong_key';

        await validateGoogleTokens(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return empty stats if no users found', async () => {
        (UserModel.find as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue([])
        });

        await validateGoogleTokens(req, res);

        expect(res.json).toHaveBeenCalledWith({
            total: 0,
            valid: 0,
            invalid: 0,
            errors: 0,
            smtp: true
        });
    });

    it('should count valid tokens correctly and send no email if auth_check_notification false', async () => {
        const mockUser = {
            _id: 'user1',
            email: 'user1@example.com',
            auth_check_notification: false,
            google_tokens: { access_token: 'token' }
        };

        (UserModel.find as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue([mockUser])
        });

        (getAuth as any).mockResolvedValue('mock_auth_client');
        mockCalendarListList.mockResolvedValue({}); // Success

        await validateGoogleTokens(req, res);

        expect(mockCalendarListList).toHaveBeenCalled();
        expect(transporter.sendMail).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            total: 1,
            valid: 1,
            invalid: 0,
            errors: 0,
            smtp: true
        });
    });

    it('should count valid tokens and send email if auth_check_notification true', async () => {
        const mockUser = {
            _id: 'user2',
            email: 'user2@example.com',
            given_name: 'User2',
            auth_check_notification: true,
            google_tokens: { access_token: 'token' }
        };

        (UserModel.find as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue([mockUser])
        });

        (getAuth as any).mockResolvedValue('mock_auth_client');
        mockCalendarListList.mockResolvedValue({}); // Success

        // Mock transporter success
        (transporter.sendMail as any).mockImplementation((opts, cb) => cb(null, {}));

        await validateGoogleTokens(req, res);

        expect(transporter.sendMail).toHaveBeenCalled();
        const mailArgs = (transporter.sendMail as any).mock.calls[0][0];
        expect(mailArgs.to).toBe('user2@example.com');
        expect(mailArgs.subject).toContain('Calendar Connection OK');

        expect(res.json).toHaveBeenCalledWith({
            total: 1,
            valid: 1,
            invalid: 0,
            errors: 0,
            smtp: true
        });
    });

    it('should handle invalid_grant error correctly', async () => {
        const mockUser = {
            _id: 'user3',
            email: 'user3@example.com',
            auth_check_notification: true, // Should send warning email regardless? Code says strictly for OK, but for invalid it ALWAYS sends?
            // Checking stats logic: Lines 62: await sendEmail(user.email, ...)
            // It sends email on invalid regardless of auth_check_notification preference? Re-reading code...
            // Code: if (isInvalid) { ... await sendEmail(...) } - Yes, looks like it sends warning always.
            google_tokens: { access_token: 'token' }
        };

        (UserModel.find as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue([mockUser])
        });

        (getAuth as any).mockResolvedValue('mock_auth_client');
        mockCalendarListList.mockRejectedValue({ message: 'invalid_grant' });

        // Mock transporter success
        (transporter.sendMail as any).mockImplementation((opts, cb) => cb(null, {}));

        await validateGoogleTokens(req, res);

        expect(transporter.sendMail).toHaveBeenCalled();
        const mailArgs = (transporter.sendMail as any).mock.calls[0][0];
        expect(mailArgs.subject).toContain('Action Required');

        expect(res.json).toHaveBeenCalledWith({
            total: 1,
            valid: 0,
            invalid: 1,
            errors: 0,
            smtp: true
        });
    });

    it('should handle 401 error as invalid', async () => {
        const mockUser = {
            _id: 'user3b',
            email: 'user3b@example.com',
            google_tokens: { access_token: 'token' }
        };
        (UserModel.find as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue([mockUser])
        });
        (getAuth as any).mockResolvedValue('mock_auth_client');
        mockCalendarListList.mockRejectedValue({ code: 401 });
        (transporter.sendMail as any).mockImplementation((opts, cb) => cb(null, {}));

        await validateGoogleTokens(req, res);

        expect(res.json).toHaveBeenCalledWith({
            total: 1,
            valid: 0,
            invalid: 1,
            errors: 0,
            smtp: true
        });
    });

    it('should handle generic errors', async () => {
        const mockUser = {
            _id: 'user4',
            email: 'user4@example.com',
            google_tokens: { access_token: 'token' }
        };

        (UserModel.find as any).mockReturnValue({
            exec: vi.fn().mockResolvedValue([mockUser])
        });

        (getAuth as any).mockResolvedValue('mock_auth_client');
        mockCalendarListList.mockRejectedValue(new Error('Random API error'));

        await validateGoogleTokens(req, res);

        expect(logger.error).toHaveBeenCalled();
        expect(transporter.sendMail).not.toHaveBeenCalled();

        expect(res.json).toHaveBeenCalledWith({
            total: 1,
            valid: 0,
            invalid: 0,
            errors: 1,
            smtp: true
        });
    });

    it('should handle getAuth failure', async () => {
        // If getAuth fails, it goes to catch block.
        const mockUser = { _id: 'user5', email: 'u5@e.com', google_tokens: {} };
        (UserModel.find as any).mockReturnValue({ exec: vi.fn().mockResolvedValue([mockUser]) });

        (getAuth as any).mockRejectedValue(new Error('Auth setup failed'));

        await validateGoogleTokens(req, res);

        expect(res.json).toHaveBeenCalledWith({
            total: 1,
            valid: 0,
            invalid: 0,
            errors: 1,
            smtp: true
        });
    });
});
