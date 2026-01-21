import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getUser, updateUser, getUserByUrl, getTransientUser, exportSettings, importSettings } from './user_services';
import * as userServices from './user_services';
import * as csrfService from './csrf_service';

// Mock axios
vi.mock('axios');

// Mock csrf service
// Mock config
vi.mock('../config', () => ({
    CONFIG: {
        API_URL: 'http://localhost:3001'
    }
}));

// Mock csrf service
vi.mock('./csrf_service', () => ({
    getCsrfToken: vi.fn()
}));

describe('user_services', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getUser', () => {
        it('should fetch current user', async () => {
            const mockUser = {
                data: {
                    _id: 'user123',
                    name: 'Test User',
                    email: 'test@example.com'
                }
            };
            vi.mocked(axios.get).mockResolvedValue(mockUser);

            const result = await getUser();

            expect(axios.get).toHaveBeenCalledWith(
                'http://localhost:3001/user/me',
                {
                    withCredentials: true
                }
            );
            expect(result.data._id).toBe('user123');
            expect(result.data.name).toBe('Test User');
        });

        it('should handle unauthorized error', async () => {
            vi.mocked(axios.get).mockRejectedValue(new Error('Unauthorized'));

            await expect(getUser()).rejects.toThrow('Unauthorized');
        });

        it('should handle network errors', async () => {
            vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));

            await expect(getUser()).rejects.toThrow('Network error');
        });
    });

    describe('updateUser', () => {
        it('should update user with CSRF token', async () => {
            const mockCsrfToken = 'csrf-token-123';
            const userData = {
                name: 'Updated Name',
                url: 'updated-url'
            };

            vi.mocked(csrfService.getCsrfToken).mockResolvedValue(mockCsrfToken);
            vi.mocked(axios.put).mockResolvedValue({ data: { success: true } });

            const result = await updateUser(userData);

            expect(csrfService.getCsrfToken).toHaveBeenCalled();
            expect(axios.put).toHaveBeenCalledWith(
                'http://localhost:3001/user/me',
                { data: userData },
                {
                    headers: {
                        'x-csrf-token': mockCsrfToken
                    },
                    withCredentials: true
                }
            );
            expect(result.data.success).toBe(true);
        });

        it('should handle validation errors', async () => {
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue('token');
            vi.mocked(axios.put).mockRejectedValue(new Error('Validation failed'));

            await expect(updateUser({ name: '' })).rejects.toThrow('Validation failed');
        });

        it('should handle CSRF token fetch failure', async () => {
            vi.mocked(csrfService.getCsrfToken).mockRejectedValue(new Error('CSRF token unavailable'));

            await expect(updateUser({ name: 'Test' })).rejects.toThrow('CSRF token unavailable');
        });

        it('should update user with complex data', async () => {
            const complexUserData = {
                name: 'Complex User',
                url: 'complex-url',
                push_calendar: 'primary',
                pull_calendars: ['cal1', 'cal2']
            };

            vi.mocked(csrfService.getCsrfToken).mockResolvedValue('token');
            vi.mocked(axios.put).mockResolvedValue({ data: complexUserData });

            const result = await updateUser(complexUserData);

            expect(axios.put).toHaveBeenCalledWith(
                expect.any(String),
                { data: complexUserData },
                expect.any(Object)
            );
            expect(result.data).toEqual(complexUserData);
        });

        it('should handle network errors during update', async () => {
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue('token');
            vi.mocked(axios.put).mockRejectedValue(new Error('Network error'));

            await expect(updateUser({ name: 'Test' })).rejects.toThrow('Network error');
        });

        it('should handle 409 conflict errors', async () => {
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue('token');
            const error: any = {
                response: {
                    status: 409,
                    data: { error: 'URL already taken' }
                }
            };
            vi.mocked(axios.put).mockRejectedValue(error);

            await expect(updateUser({ url: 'taken-url' })).rejects.toThrow();
        });

        it('should handle 401 unauthorized errors', async () => {
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue('token');
            const error: any = {
                response: {
                    status: 401,
                    data: { error: 'Unauthorized' }
                }
            };
            vi.mocked(axios.put).mockRejectedValue(error);

            await expect(updateUser({ name: 'Test' })).rejects.toThrow();
        });
    });

    describe('getUserByUrl', () => {
        it('should fetch user by URL', async () => {
            const url = 'john-doe';
            const mockUser = {
                data: {
                    _id: 'user456',
                    name: 'John Doe',
                    url: 'john-doe'
                }
            };
            vi.mocked(axios.get).mockResolvedValue(mockUser);

            const result = await getUserByUrl(url);

            expect(axios.get).toHaveBeenCalledWith(
                `http://localhost:3001/user/${url}`
            );
            expect(result.data.url).toBe('john-doe');
        });

        it('should handle user not found', async () => {
            vi.mocked(axios.get).mockRejectedValue(new Error('User not found'));

            await expect(getUserByUrl('nonexistent')).rejects.toThrow('User not found');
        });

        it('should handle special characters in URL', async () => {
            const url = 'user-with-special_chars';
            vi.mocked(axios.get).mockResolvedValue({ data: {} });

            await getUserByUrl(url);

            expect(axios.get).toHaveBeenCalledWith(
                `http://localhost:3001/user/${url}`
            );
        });

        it('should not include credentials by default', async () => {
            vi.mocked(axios.get).mockResolvedValue({ data: {} });

            await getUserByUrl('test-user');

            // Verify that withCredentials is NOT set (public endpoint)
            expect(axios.get).toHaveBeenCalledWith(
                expect.any(String)
            );
            expect(axios.get).not.toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ withCredentials: true })
            );
        });
    });

    describe('getTransientUser', () => {
        it('should fetch transient user', async () => {
            const mockUser = { data: { _id: 'transient', role: 'anonymous' } };
            vi.mocked(axios.get).mockResolvedValue(mockUser);

            const result = await userServices.getTransientUser();

            expect(axios.get).toHaveBeenCalledWith(
                'http://localhost:3001/user/transient',
                { withCredentials: true }
            );
            expect(result).toEqual(mockUser);
        });
    });

    describe('exportSettings', () => {
        it('should call export endpoint', async () => {
            const mockResponse = { data: { user: {}, events: [] } };
            vi.mocked(axios.get).mockResolvedValue(mockResponse);

            const result = await userServices.exportSettings();

            expect(axios.get).toHaveBeenCalledWith(
                'http://localhost:3001/user/settings',
                { withCredentials: true }
            );
            expect(result).toEqual(mockResponse);
        });
    });

    describe('importSettings', () => {
        it('should call import endpoint with csrf token', async () => {
            const mockCsrfToken = 'test-token';
            const settingsData = { user: { theme: 'light' }, events: [] };
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue(mockCsrfToken);
            vi.mocked(axios.put).mockResolvedValue({ data: { message: 'Success' } });

            await userServices.importSettings(settingsData);

            expect(csrfService.getCsrfToken).toHaveBeenCalled();
            expect(axios.put).toHaveBeenCalledWith(
                'http://localhost:3001/user/settings',
                settingsData,
                {
                    headers: { 'x-csrf-token': mockCsrfToken },
                    withCredentials: true
                }
            );
        });
    });
});
