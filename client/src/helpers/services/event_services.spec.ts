import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { Event, IntervalSet } from 'common';
import * as eventServices from './event_services';
import * as csrfService from './csrf_service';
import { CONFIG } from '../config';

// Mock axios
vi.mock('axios');

// Mock csrf_service
vi.mock('./csrf_service', () => ({
    getCsrfToken: vi.fn(),
}));

// Mock config
vi.mock('../config', () => ({
    CONFIG: {
        API_URL: 'http://test-api.com',
    },
}));

describe('Event Services', () => {
    const mockCsrfToken = 'mock-csrf-token';
    const mockEvent: Event = {
        id: 'test-event-id',
        title: 'Test Event',
        description: 'Test Description',
        user: 'test-user',
        duration: 30,
        available: {},
    } as Event;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(csrfService.getCsrfToken).mockResolvedValue(mockCsrfToken);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('saveUserEvent', () => {
        it('should POST to /event with correct data and headers', async () => {
            const userid = 'test-user-id';
            const mockResponse = { data: 'success' };
            vi.mocked(axios.post).mockResolvedValue(mockResponse);

            const response = await eventServices.saveUserEvent(mockEvent, userid);

            expect(csrfService.getCsrfToken).toHaveBeenCalled();
            expect(axios.post).toHaveBeenCalledWith(
                `${CONFIG.API_URL}/event`,
                { ...mockEvent, user: userid },
                {
                    headers: { 'x-csrf-token': mockCsrfToken },
                    withCredentials: true,
                }
            );
            expect(response).toEqual(mockResponse);
        });
    });

    describe('deleteEvent', () => {
        it('should DELETE /event/:id with correct headers', async () => {
            const eventId = 'test-event-id';
            const mockResponse = { data: 'deleted' };
            vi.mocked(axios.delete).mockResolvedValue(mockResponse);

            const response = await eventServices.deleteEvent(eventId);

            expect(csrfService.getCsrfToken).toHaveBeenCalled();
            expect(axios.delete).toHaveBeenCalledWith(
                `${CONFIG.API_URL}/event/${eventId}`,
                {
                    headers: { 'x-csrf-token': mockCsrfToken },
                    withCredentials: true,
                }
            );
            expect(response).toEqual(mockResponse);
        });
    });

    describe('getEventByID', () => {
        it('should GET /event/:id', async () => {
            const eventId = 'test-event-id';
            const mockResponse = { data: mockEvent };
            vi.mocked(axios.get).mockResolvedValue(mockResponse);

            const response = await eventServices.getEventByID(eventId);

            expect(axios.get).toHaveBeenCalledWith(
                `${CONFIG.API_URL}/event/${eventId}`,
                { withCredentials: true }
            );
            expect(response).toEqual(mockResponse);
        });
    });

    describe('updateEvent', () => {
        it('should PUT to /event/:id with correct data and headers', async () => {
            const eventId = 'test-event-id';
            const mockResponse = { data: 'updated' };
            vi.mocked(axios.put).mockResolvedValue(mockResponse);

            const response = await eventServices.updateEvent(eventId, mockEvent);

            expect(csrfService.getCsrfToken).toHaveBeenCalled();
            expect(axios.put).toHaveBeenCalledWith(
                `${CONFIG.API_URL}/event/${eventId}`,
                { data: mockEvent },
                {
                    headers: { 'x-csrf-token': mockCsrfToken },
                    withCredentials: true,
                }
            );
            expect(response).toEqual(mockResponse);
        });
    });

    describe('getActiveEvents', () => {
        it('should GET /event/active/:userid', async () => {
            const userId = 'test-user-id';
            const mockResponse = { data: [mockEvent] };
            vi.mocked(axios.get).mockResolvedValue(mockResponse);

            const response = await eventServices.getActiveEvents(userId);

            expect(axios.get).toHaveBeenCalledWith(
                `${CONFIG.API_URL}/event/active/${userId}`
            );
            expect(response).toEqual(mockResponse);
        });
    });

    describe('getAvailableTimes', () => {
        it('should GET /event/:id/slot and return IntervalSet', async () => {
            const timeMin = new Date('2023-01-01');
            const timeMax = new Date('2023-01-02');
            const eventId = 'test-event-id';
            const mockResponse = { data: [] }; // IntervalSet constructor handles array
            vi.mocked(axios.get).mockResolvedValue(mockResponse);

            const result = await eventServices.getAvailableTimes(timeMin, timeMax, eventId);

            expect(axios.get).toHaveBeenCalledWith(
                `${CONFIG.API_URL}/event/${eventId}/slot`,
                {
                    params: { timeMin, timeMax },
                }
            );
            expect(result.slots).toBeInstanceOf(IntervalSet);
        });
    });

    describe('getUsersEvents', () => {
        it('should GET /event', async () => {
            const mockResponse = { data: [mockEvent] };
            vi.mocked(axios.get).mockResolvedValue(mockResponse);

            const response = await eventServices.getUsersEvents();

            expect(axios.get).toHaveBeenCalledWith(
                `${CONFIG.API_URL}/event`,
                { withCredentials: true }
            );
            expect(response).toEqual(mockResponse);
        });
    });

    describe('getEventByUrlAndUser', () => {
        it('should GET /event/:user/:url', async () => {
            const userId = 'test-user-id';
            const eventUrl = 'test-event-url';
            const mockResponse = { data: mockEvent };
            vi.mocked(axios.get).mockResolvedValue(mockResponse);

            const response = await eventServices.getEventByUrlAndUser(userId, eventUrl);

            expect(axios.get).toHaveBeenCalledWith(
                `${CONFIG.API_URL}/event/${userId}/${eventUrl}`
            );
            expect(response).toEqual(mockResponse);
        });
    });
});
