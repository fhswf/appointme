import { describe, expect, it, vi, afterEach } from 'vitest';
import { createUserWithUniqueUrl, validateUrl, findOrUpdateGoogleUser } from '../services/user_service.js';
import { UserModel } from '../models/User.js';

// Mock UserModel
vi.mock("../models/User.js", () => {
    return {
        UserModel: {
            findOneAndUpdate: vi.fn(),
            findOne: vi.fn(),
        }
    }
});

describe('User Service', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('validateUrl', () => {
        it('should generate a valid slug from email', () => {
            expect(validateUrl('Test.User@example.com')).toBe('test-user');
            expect(validateUrl('foo+bar@example.com')).toBe('foo+bar'); // Wait, split('@') takes first part.
            // "foo+bar".replaceAll ...
            // Let's check regex: /[. ,:]+/g -> -
            // /[~\/]/g -> -
            // + is not replaced.
        });
    });

    describe('createUserWithUniqueUrl', () => {
        it('should create a user successfully on first try', async () => {
            const mockExec = vi.fn().mockResolvedValue({ _id: '123', user_url: 'test-user' });
            (UserModel.findOneAndUpdate as any).mockReturnValue({ exec: mockExec });

            const user = await createUserWithUniqueUrl('sub123', 'test.user@example.com');

            expect(user).toBeDefined();
            expect(UserModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
            expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: 'sub123' },
                expect.objectContaining({
                    $setOnInsert: { user_url: 'test-user' }
                }),
                expect.any(Object)
            );
        });

        it('should retry with suffix on collision', async () => {
            const error = new Error('Duplicate key');
            (error as any).code = 11000;
            (error as any).keyPattern = { user_url: 1 };

            const mockExec = vi.fn()
                .mockRejectedValueOnce(error) // First fail
                .mockResolvedValueOnce({ _id: '123', user_url: 'test-user-1234' }); // Then succeed

            (UserModel.findOneAndUpdate as any).mockReturnValue({ exec: mockExec });

            // Spy on Math.random to make test deterministic, but suffix is random number
            // The service uses `${validateUrl(email)}-${Math.floor(Math.random() * 100000)}`

            const user = await createUserWithUniqueUrl('sub123', 'test.user@example.com');

            expect(UserModel.findOneAndUpdate).toHaveBeenCalledTimes(2);
            // Verify second call had a hyphen in user_url
            const secondCallArgs = (UserModel.findOneAndUpdate as any).mock.calls[1];
            const setOnInsert = secondCallArgs[1].$setOnInsert;
            expect(setOnInsert.user_url).toMatch(/^test-user-\d+$/);
        });

        it('should throw error after max retries', async () => {
            const error = new Error('Duplicate key');
            (error as any).code = 11000;
            (error as any).keyPattern = { user_url: 1 };

            const mockExec = vi.fn().mockRejectedValue(error);
            (UserModel.findOneAndUpdate as any).mockReturnValue({ exec: mockExec });

            await expect(createUserWithUniqueUrl('sub123', 'test.user@example.com')).rejects.toThrow(/after 10 retries/);

            // Should retry 10 times total?
            // initial try + 10 retries? No, `while (retry < maxRetries)`
            // try 0, catch, retry=1. 
            // loop runs when retry < 10.
            // so 10 attempts? 
            // 0...9?
            // "retry" var starts at 0.
            // Loop while retry < 10.
            // inside catch: retry++.
            // So it runs 10 times.
            expect(UserModel.findOneAndUpdate).toHaveBeenCalledTimes(10);
        });
    });

    describe('findOrUpdateGoogleUser', () => {
        it('should update existing user profile', async () => {
            const mockUser = {
                _id: 'user123',
                use_gravatar: false,
                email: 'test@example.com',
                save: vi.fn()
            };
            (UserModel.findOne as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(mockUser) });
            (UserModel.findOneAndUpdate as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ ...mockUser, name: 'New Name' }) });

            await findOrUpdateGoogleUser('user123', 'test@example.com', 'New Name', 'pic.jpg');

            expect(UserModel.findOne).toHaveBeenCalledWith({ $or: [{ email: 'test@example.com' }, { _id: 'user123' }] });
            expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: 'user123' },
                { $set: { name: 'New Name', email: 'test@example.com', google_picture_url: 'pic.jpg', picture_url: 'pic.jpg' } },
                { new: true }
            );
        });

        it('should NOT update picture_url if use_gravatar is true', async () => {
            const mockUser = {
                _id: 'user123',
                use_gravatar: true,
                email: 'test@example.com'
            };
            (UserModel.findOne as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(mockUser) });
            (UserModel.findOneAndUpdate as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(mockUser) });

            await findOrUpdateGoogleUser('user123', 'test@example.com', 'New Name', 'pic.jpg');

            expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
                expect.anything(),
                { $set: { name: 'New Name', email: 'test@example.com', google_picture_url: 'pic.jpg' } },
                expect.anything()
            );
        });

        it('should create new user if not found', async () => {
            (UserModel.findOne as any).mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });
            // Mock findOneAndUpdate for the createUserWithUniqueUrl call that happens inside
            (UserModel.findOneAndUpdate as any).mockReturnValue({ exec: vi.fn().mockResolvedValue({ _id: 'newuser' }) });

            await findOrUpdateGoogleUser('new_sub', 'new@example.com', 'New User', 'pic.jpg');

            // Verify findOne called
            expect(UserModel.findOne).toHaveBeenCalled();
            // Verify findOneAndUpdate called for creation (upsert: true)
            expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: 'new_sub' },
                expect.objectContaining({ $setOnInsert: expect.any(Object) }),
                expect.objectContaining({ upsert: true, new: true, runValidators: true })
            );
        });
    });
});
