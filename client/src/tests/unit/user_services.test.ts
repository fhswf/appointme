
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
        const user_response = { data: 'user-data' };
        (axios.get as any).mockResolvedValueOnce(user_response);

        const result = await getUser();

        expect(axios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL}/user/me`, { withCredentials: true });
        expect(result).toEqual(user_response);
    });

    it('updateUser should call axios.put with CSRF token', async () => {
        (axios.put as any).mockResolvedValue({ data: 'success' });

        const userData = { name: 'New Name' };
        await updateUser(userData);

        expect(csrfService.getCsrfToken).toHaveBeenCalled();
        expect(axios.put).toHaveBeenCalledWith(
            expect.stringContaining('/user/me'),
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
            expect.stringContaining('/user/test-url')
        );
    });
});
