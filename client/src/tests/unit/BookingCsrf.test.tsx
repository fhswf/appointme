import { describe, it, expect, vi, beforeEach } from 'vitest';
import { insertEvent } from '../../helpers/services/google_services';
import { getCsrfToken } from '../../helpers/services/csrf_service';
import axios from 'axios';
import { CONFIG } from '../../helpers/config';

// Mock dependencies
vi.mock('axios');
vi.mock('../../helpers/services/csrf_service');
vi.mock('../../config', () => ({
    CONFIG: { API_URL: 'http://localhost/api' }
}));

describe('Frontend CSRF Token Handling', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('insertEvent should fetch CSRF token and include it in headers', async () => {
        // Setup mocks
        const mockCsrfToken = "mock-csrf-token-123";
        (getCsrfToken as any).mockResolvedValue(mockCsrfToken);
        (axios.post as any).mockResolvedValue({ data: { success: true } });

        // Call the function
        const eventId = "evt_123";
        const time = new Date("2024-01-01T10:00:00Z");
        const name = "John Doe";
        const email = "john@example.com";
        const description = "Test booking";

        await insertEvent(eventId, time, name, email, description);

        // Verify getCsrfToken was called
        expect(getCsrfToken).toHaveBeenCalledTimes(1);

        // Verify axios.post was called with correct arguments
        expect(axios.post).toHaveBeenCalledWith(
            `${CONFIG.API_URL}/event/${eventId}/slot`,
            {
                start: time.valueOf(),
                attendeeName: name,
                attendeeEmail: email,
                description: description,
            },
            expect.objectContaining({
                headers: expect.objectContaining({
                    "x-csrf-token": mockCsrfToken
                }),
                withCredentials: true
            })
        );
    });

    it('insertEvent should fetch CSRF token and include it in headers (Anonymous User)', async () => {
        // Setup mocks - same behavior expected for anonymous users
        const mockCsrfToken = "mock-csrf-token-anon-999";
        (getCsrfToken as any).mockResolvedValue(mockCsrfToken);
        (axios.post as any).mockResolvedValue({ data: { success: true } });

        // Call the function
        const eventId = "evt_anon";
        const time = new Date("2024-02-01T15:00:00Z");
        const name = "Anonymous Guest";
        const email = "guest@example.com";
        const description = "Anonymous booking";

        await insertEvent(eventId, time, name, email, description);

        // Verify behavior is identical
        expect(getCsrfToken).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(
            `${CONFIG.API_URL}/event/${eventId}/slot`,
            expect.objectContaining({
                start: time.valueOf(),
                attendeeName: "Anonymous Guest",
                attendeeEmail: "guest@example.com",
            }),
            expect.objectContaining({
                headers: expect.objectContaining({
                    "x-csrf-token": mockCsrfToken
                }),
                withCredentials: true
            })
        );
    });
});
