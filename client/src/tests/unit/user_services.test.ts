
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getUser, updateUser, getUserByUrl } from '../../helpers/services/user_services';
import * as csrfService from '../../helpers/services/csrf_service';

vi.mock('axios');
vi.mock('../../helpers/services/csrf_service');

describe('User Services', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(csrfService, 'getCsrfToken').mockResolvedValue('mock-csrf-token');
    });

    it('getUser should call axios.get', async () => {
        (axios.get as any).mockResolvedValue({ data: 'user-data' });

        const response = await getUser();

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/users/user'),
            { withCredentials: true }
        );
        expect(response).toEqual({ data: 'user-data' });
    });

    it('updateUser should call axios.put with CSRF token', async () => {
        (axios.put as any).mockResolvedValue({ data: 'success' });

        const userData = { name: 'New Name' };
        await updateUser(userData);

        expect(csrfService.getCsrfToken).toHaveBeenCalled();
        expect(axios.put).toHaveBeenCalledWith(
            expect.stringContaining('/users/user'),
            { data: userData },
            {
                headers: { 'x-csrf-token': 'mock-csrf-token' },
                withCredentials: true
            }
        );
    });

    it('getUserByUrl should call axios.get with params', async () => {
        (axios.get as any).mockResolvedValue({ data: 'user-data' });

        await getUserByUrl('test-url');

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/users/user/test-url'),
            { params: { url: 'test-url' } }
        );
    });
});
