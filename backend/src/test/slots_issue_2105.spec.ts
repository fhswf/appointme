/**
 * Regression test for: booking page shows slots after 21:00 on April 23,
 * despite availability configured for 20:00–21:05 (Europe/Berlin).
 *
 * Root cause: the slot-generation loop in getAvailableTimes used strict `<`
 * instead of `<=`, AND blocked.inverse() was not clamped to timeMin/timeMax,
 * allowing free intervals to bleed past midnight and produce extra slots.
 */
import { afterAll, beforeAll, describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { EVENT } from './EVENT.js';
import { USER } from './USER.js';
import { EventModel } from '../models/Event.js';
import { UserModel } from '../models/User.js';
import { IntervalSet, Day } from 'common';
import { calculateFreeSlots } from '../controller/event_controller.js';
import { convertBusyToFree } from '../utility/scheduler.js';

// ──────────────────────────────────────────────────────────────────
// Mocks (mirror the pattern from slots_feature.spec.ts)
// ──────────────────────────────────────────────────────────────────
vi.mock('../models/Event.js', () => {
    const save = vi.fn().mockResolvedValue(EVENT);
    const EventModelMock = vi.fn().mockImplementation(function (data) {
        return { ...data, save };
    });
    (EventModelMock as any).findOne = vi.fn();
    (EventModelMock as any).findByIdAndDelete = vi.fn();
    (EventModelMock as any).find = vi.fn();
    (EventModelMock as any).findById = vi.fn();
    (EventModelMock as any).findByIdAndUpdate = vi.fn();
    return { EventModel: EventModelMock, EventDocument: {} };
});

vi.mock('../models/User.js', () => {
    const UserModelMock = vi.fn();
    (UserModelMock as any).findOne = vi.fn();
    (UserModelMock as any).findById = vi.fn();
    return { UserModel: UserModelMock };
});

vi.mock('../models/Appointment.js', () => {
    const AppointmentModelMock = vi.fn();
    return { AppointmentModel: AppointmentModelMock };
});

vi.mock('../handlers/middleware.js', () => ({
    middleware: {
        requireAuth: vi.fn((req, _res, next) => {
            req.user_id = USER._id;
            next();
        }),
        optionalAuth: vi.fn((_req, _res, next) => next()),
    },
}));

vi.mock('../config/dbConn.js', () => ({ dataBaseConn: vi.fn() }));
vi.mock('csrf-csrf', () => ({
    doubleCsrf: () => ({
        doubleCsrfProtection: (_req, _res, next) => next(),
        generateCsrfToken: () => 'mock_csrf_token',
    }),
}));
vi.mock('../utility/mailer.js', () => ({ sendEventInvitation: vi.fn().mockResolvedValue({}) }));
vi.mock('../controller/google_controller.js', () => ({
    checkFree: vi.fn().mockResolvedValue(true),
    insertGoogleEvent: vi.fn().mockResolvedValue({ status: 'confirmed', htmlLink: 'http://google.com/event' }),
    events: vi.fn().mockResolvedValue([]),
    freeBusy: vi.fn().mockResolvedValue({ data: { calendars: {} } }),
    revokeScopes: vi.fn().mockResolvedValue({}),
    generateAuthUrl: vi.fn().mockReturnValue('http://auth.url'),
    getCalendarList: vi.fn().mockResolvedValue([]),
    googleCallback: vi.fn().mockResolvedValue({}),
}));
vi.mock('../controller/caldav_controller.js', () => ({
    createCalDavEvent: vi.fn().mockResolvedValue({ ok: true }),
    getBusySlots: vi.fn().mockResolvedValue([]),
    addAccount: vi.fn().mockImplementation((_req, res) => res.json({})),
    listAccounts: vi.fn().mockImplementation((_req, res) => res.json([])),
    removeAccount: vi.fn().mockImplementation((_req, res) => res.json({})),
    listCalendars: vi.fn().mockImplementation((_req, res) => res.json([])),
    findAccountForCalendar: vi.fn().mockReturnValue({ username: 'test@caldav.com', serverUrl: 'https://caldav.example.com' }),
}));

const mockQuery = (result: any) => ({
    exec: vi.fn().mockResolvedValue(result),
    select: vi.fn().mockReturnThis(),
});

// ──────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────
/** Thu Apr 23 20:00–21:05 Berlin = 18:00–19:05 UTC */
const AVAIL_START_UTC = '2026-04-23T18:00:00.000Z';
const AVAIL_END_UTC   = '2026-04-23T19:05:00.000Z';

/** Slots that would be OUTSIDE the availability window (≥ 21:05 Berlin / 19:05 UTC) */
const isOutsideWindow = (isoSlot: string): boolean =>
    new Date(isoSlot) >= new Date(AVAIL_END_UTC);

// ──────────────────────────────────────────────────────────────────
// Unit-level test: calculateFreeSlots directly
// ──────────────────────────────────────────────────────────────────
describe('Regression: Thu 20:00–21:05 availability (unit)', () => {
    // Week of April 20–27 2026. Thursday is April 23.
    const timeMin = new Date('2026-04-20T00:00:00Z');
    const timeMax = new Date('2026-04-27T00:00:00Z');

    const event = {
        availabilityMode: 'define',
        duration: 15,
        bufferbefore: 0,
        bufferafter: 0,
        minFuture: 0,
        maxFuture: 1e9,
        available: {
            [Day.SUNDAY]:    [],
            [Day.MONDAY]:    [],
            [Day.TUESDAY]:   [],
            [Day.WEDNESDAY]: [],
            [Day.THURSDAY]:  [{ start: '20:00', end: '21:05' }],
            [Day.FRIDAY]:    [],
            [Day.SATURDAY]:  [],
        },
    };

    const user = { defaultAvailable: null };
    // No pre-existing blocked appointments → use the sentinel-only blocked set
    const blocked = new IntervalSet([
        { start: new Date(timeMin.getTime() - 1), end: new Date(timeMin) },
        { start: new Date(timeMax),               end: new Date(timeMax.getTime() + 1) },
    ]);

    it('IntervalSet produces exactly the Thu 18:00–19:05 UTC interval', () => {
        const avail = new IntervalSet(timeMin, timeMax, event.available as any, 'Europe/Berlin');
        expect(avail).toHaveLength(1);
        expect(avail[0].start.toISOString()).toBe(AVAIL_START_UTC);
        expect(avail[0].end.toISOString()).toBe(AVAIL_END_UTC);
    });

    it('calculateFreeSlots returns intervals strictly within 18:00–19:05 UTC', () => {
        const freeSlots = calculateFreeSlots(
            { data: { calendars: {} } },
            [],
            event,
            timeMin,
            timeMax,
            blocked,
            user,
        );

        expect(freeSlots.length).toBeGreaterThan(0);
        for (const slot of freeSlots) {
            expect(slot.start.getTime()).toBeGreaterThanOrEqual(new Date(AVAIL_START_UTC).getTime());
            expect(slot.end.getTime()).toBeLessThanOrEqual(new Date(AVAIL_END_UTC).getTime());
        }
    });

    it('slot enumeration (15-min steps) produces no slot starting at or after 21:05 Berlin (19:05 UTC)', () => {
        const freeSlots = calculateFreeSlots(
            { data: { calendars: {} } },
            [],
            event,
            timeMin,
            timeMax,
            blocked,
            user,
        );

        const slots: string[] = [];
        for (const slot of freeSlots) {
            let s = slot.start.getTime();
            const endMs = slot.end.getTime();
            while (s + event.duration * 60_000 <= endMs) {
                slots.push(new Date(s).toISOString());
                s += event.duration * 60_000;
            }
        }

        // Must have some slots inside the window
        expect(slots.length).toBeGreaterThan(0);

        // Expected slots: 18:00, 18:15, 18:30, 18:45 UTC  (19:00 would end at 19:15 > 19:05, excluded)
        const expectedSlots = [
            '2026-04-23T18:00:00.000Z',
            '2026-04-23T18:15:00.000Z',
            '2026-04-23T18:30:00.000Z',
            '2026-04-23T18:45:00.000Z',
        ];
        expect(slots).toEqual(expectedSlots);

        // No slot must start at or after the availability end (19:05 UTC = 21:05 Berlin)
        const violating = slots.filter(isOutsideWindow);
        expect(violating).toHaveLength(0);
    });
});

// ──────────────────────────────────────────────────────────────────
// Integration test: full HTTP round-trip via supertest
// ──────────────────────────────────────────────────────────────────
describe('Regression: Thu 20:00–21:05 availability (HTTP)', () => {
    let app: any;

    beforeAll(async () => {
        process.env.JWT_SECRET = 'test_secret';
        const { init } = await import('../server.js');
        app = init(0);
    });

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        // Freeze time at Apr 20 2026 (before the Thursday in question)
        vi.setSystemTime(new Date('2026-04-20T00:00:00Z'));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    afterAll(async () => {
        if (app?.close) await app.close();
    });

    it('GET /api/v1/event/:id/slot?slots=true returns no slots after 21:05 Berlin', async () => {
        (EventModel.findById as any).mockImplementation(() =>
            mockQuery({
                ...EVENT,
                timeZone: 'Europe/Berlin',
                minFuture: 0,
                maxFuture: 24 * 60 * 60 * 365,
                duration: 15,
                bufferbefore: 0,
                bufferafter: 0,
                maxPerDay: 10,
                user: USER._id,
                availabilityMode: 'define',
                available: {
                    '0': [], '1': [], '2': [], '3': [],
                    // Thursday = 4
                    '4': [{ start: '20:00', end: '21:05' }],
                    '5': [], '6': [],
                },
            }),
        );
        (UserModel.findById as any).mockImplementation(() => mockQuery(USER));

        const { freeBusy, events } = await import('../controller/google_controller.js');
        const { getBusySlots } = await import('../controller/caldav_controller.js');
        (events as any).mockResolvedValue([]);
        (freeBusy as any).mockResolvedValue({ data: { calendars: {} } });
        (getBusySlots as any).mockResolvedValue([]);

        const res = await request(app)
            .get('/api/v1/event/123/slot')
            .query({
                timeMin: '2026-04-20T00:00:00Z',
                timeMax: '2026-04-27T00:00:00Z',
                slots: 'true',
            });

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        const slots: string[] = res.body;

        // Must have slots on the Thursday evening
        const thuSlots = slots.filter(s => s.startsWith('2026-04-23T18'));
        expect(thuSlots.length).toBeGreaterThan(0);

        // No slot may start at or after 19:05 UTC (= 21:05 Berlin)
        const violating = slots.filter(isOutsideWindow);
        expect(
            violating,
            `Expected no slots after 21:05 Berlin (19:05 UTC), but got: ${violating.join(', ')}`,
        ).toHaveLength(0);
    });
});
