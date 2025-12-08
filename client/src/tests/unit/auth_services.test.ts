
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { postToRegister, postToActivate, postGoogleLogin, postLogin } from '../../helpers/services/auth_services';
import * as csrfService from '../../helpers/services/csrf_service';

vi.mock('axios');
vi.mock('../../helpers/services/csrf_service');

describe('Auth Services', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock CSRF token
        vi.spyOn(csrfService, 'getCsrfToken').mockResolvedValue('mock-csrf-token');
    });

    it('postToRegister should call axios.post with correct arguments', async () => {
        (axios.post as any).mockResolvedValue({ data: 'success' });

        await postToRegister('Test User', 'test@example.com', 'password');

        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/auth/register'),
            {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password'
            },
            {
                headers: { 'x-csrf-token': 'mock-csrf-token' }
            }
        );
    });

    it('postToActivate should call axios.post with correct arguments', async () => {
        (axios.post as any).mockResolvedValue({ data: 'success' });

        await postToActivate('valid-token');

        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/auth/activate'),
            {},
            {
                headers: { 'x-csrf-token': 'mock-csrf-token' },
                withCredentials: true
            }
        );
    });

    it('postGoogleLogin should call axios.post with correct arguments and CSRF token', async () => {
        (axios.post as any).mockResolvedValue({ data: 'success' });

        await postGoogleLogin('google-code');

        expect(csrfService.getCsrfToken).toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/auth/google_oauth2_code'),
            { code: 'google-code' },
            {
                headers: { 'x-csrf-token': 'mock-csrf-token' },
                withCredentials: true
            }
        );
    });

    it('postLogin should call axios.post with correct arguments and CSRF token', async () => {
        (axios.post as any).mockResolvedValue({ data: 'success' });

        await postLogin('test@example.com', 'password');

        expect(csrfService.getCsrfToken).toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/auth/login'),
            {
                email: 'test@example.com',
                password: 'password'
            },
            {
                headers: { 'x-csrf-token': 'mock-csrf-token' },
                withCredentials: true
            }
        );
    });
});
