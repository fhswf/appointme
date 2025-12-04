
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getCsrfToken } from '../../helpers/services/csrf_service';

vi.mock('axios');

describe('CSRF Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getCsrfToken should call axios.get and return token', async () => {
        (axios.get as any).mockResolvedValue({ data: { csrfToken: 'mock-token' } });

        const token = await getCsrfToken();

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/csrf-token'),
            { withCredentials: true }
        );
        expect(token).toBe('mock-token');
    });
});
