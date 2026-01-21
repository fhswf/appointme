import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { deleteAccess, getAuthUrl, getCalendarList, insertEvent } from './google_services';
import * as csrfService from './csrf_service';

// Mock axios
vi.mock('axios');

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

describe('google_services', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('deleteAccess', () => {
        it('should call delete endpoint with CSRF token', async () => {
            const mockCsrfToken = 'test-csrf-token';
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue(mockCsrfToken);
            vi.mocked(axios.delete).mockResolvedValue({ data: { success: true } });

            const result = await deleteAccess('test-token');

            expect(csrfService.getCsrfToken).toHaveBeenCalled();
            expect(axios.delete).toHaveBeenCalledWith(
                'http://localhost:3001/google/revoke',
                {
                    data: null,
                    headers: {
                        'x-csrf-token': mockCsrfToken
                    },
                    withCredentials: true
                }
            );
            expect(result.data.success).toBe(true);
        });

        it('should handle errors', async () => {
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue('token');
            vi.mocked(axios.delete).mockRejectedValue(new Error('Network error'));

            await expect(deleteAccess('test-token')).rejects.toThrow('Network error');
        });
    });

    describe('getAuthUrl', () => {
        it('should call generateUrl endpoint', async () => {
            const mockResponse = { data: { url: 'https://accounts.google.com/auth' } };
            vi.mocked(axios.get).mockResolvedValue(mockResponse);

            const result = await getAuthUrl();

            expect(axios.get).toHaveBeenCalledWith(
                'http://localhost:3001/google/generateUrl',
                {
                    withCredentials: true
                }
            );
            expect(result).toEqual(mockResponse);
        });

        it('should handle errors', async () => {
            vi.mocked(axios.get).mockRejectedValue(new Error('API error'));

            await expect(getAuthUrl()).rejects.toThrow('API error');
        });
    });

    describe('getCalendarList', () => {
        it('should call calendarList endpoint', async () => {
            const mockCalendars = {
                data: {
                    items: [
                        { id: 'cal1', summary: 'Calendar 1' },
                        { id: 'cal2', summary: 'Calendar 2' }
                    ]
                }
            };
            vi.mocked(axios.get).mockResolvedValue(mockCalendars);

            const result = await getCalendarList();

            expect(axios.get).toHaveBeenCalledWith(
                'http://localhost:3001/google/calendarList',
                {
                    withCredentials: true
                }
            );
            expect(result.data.items).toHaveLength(2);
        });

        it('should handle empty calendar list', async () => {
            vi.mocked(axios.get).mockResolvedValue({ data: { items: [] } });

            const result = await getCalendarList();

            expect(result.data.items).toHaveLength(0);
        });

        it('should handle errors', async () => {
            vi.mocked(axios.get).mockRejectedValue(new Error('Unauthorized'));

            await expect(getCalendarList()).rejects.toThrow('Unauthorized');
        });
    });

    describe('insertEvent', () => {
        it('should post event with all parameters', async () => {
            const eventId = 'event123';
            const time = new Date('2025-01-15T10:00:00Z');
            const name = 'John Doe';
            const email = 'john@example.com';
            const description = 'Test meeting';

            const mockResponse = { data: { success: true, eventId: 'created-event-id' } };
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue('token');
            vi.mocked(axios.post).mockResolvedValue(mockResponse);

            const result = await insertEvent(eventId, time, name, email, description);

            expect(axios.post).toHaveBeenCalledWith(
                `http://localhost:3001/event/${eventId}/slot`,
                {
                    start: time.valueOf(),
                    attendeeName: name,
                    attendeeEmail: email,
                    description
                },
                {
                    headers: {
                        'x-csrf-token': 'token'
                    },
                    withCredentials: true
                }
            );
            expect(result).toEqual(mockResponse);
        });

        it('should convert time to valueOf', async () => {
            const time = new Date('2025-01-15T14:30:00Z');
            vi.mocked(axios.post).mockResolvedValue({ data: {} });
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue('token');

            await insertEvent('event1', time, 'Name', 'email@test.com', 'Description');

            expect(axios.post).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    start: time.valueOf()
                }),
                expect.objectContaining({
                    headers: {
                        'x-csrf-token': 'token'
                    },
                    withCredentials: true
                })
            );
        });

        it('should handle errors', async () => {
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue('token');
            vi.mocked(axios.post).mockRejectedValue(new Error('Slot not available'));

            await expect(
                insertEvent('event1', new Date(), 'Name', 'email@test.com', 'Desc')
            ).rejects.toThrow('Slot not available');
        });

        it('should handle missing description', async () => {
            vi.mocked(csrfService.getCsrfToken).mockResolvedValue('token');
            vi.mocked(axios.post).mockResolvedValue({ data: {} });

            await insertEvent('event1', new Date(), 'Name', 'email@test.com', '');

            expect(axios.post).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    description: ''
                }),
                expect.objectContaining({
                    headers: {
                        'x-csrf-token': 'token'
                    },
                    withCredentials: true
                })
            );
        });
    });
});
