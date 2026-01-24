
import { afterAll, beforeAll, describe, expect, it, vi, beforeEach } from 'vitest';
import { EVENT } from './EVENT.js';
import { USER } from './USER.js';
import { EventModel } from "../models/Event.js";
import { UserModel } from "../models/User.js";
import { addEventController, updateEventController } from "../controller/event_controller.js";
import { validationResult } from "express-validator";

// Mock dependencies
vi.mock("../models/Event.js", () => {
    const save = vi.fn().mockResolvedValue(EVENT);
    const EventModelMock = vi.fn().mockImplementation(function (data) {
        return ({
            ...data,
            save: save
        });
    });

    (EventModelMock as any).findOne = vi.fn();
    (EventModelMock as any).findByIdAndDelete = vi.fn();
    (EventModelMock as any).find = vi.fn();
    (EventModelMock as any).findById = vi.fn();
    (EventModelMock as any).findByIdAndUpdate = vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue(EVENT)
    });

    return {
        EventModel: EventModelMock,
        EventDocument: {}
    }
});

vi.mock("../models/User.js", () => {
    const UserModelMock = vi.fn();
    (UserModelMock as any).findOne = vi.fn();
    (UserModelMock as any).findById = vi.fn();
    return { UserModel: UserModelMock };
});

vi.mock("express-validator", () => ({
    validationResult: vi.fn().mockReturnValue({
        isEmpty: () => true,
        array: () => []
    }),
    ValidationError: class { }
}));

// Global default mocks for findById
const mockQuery = (result: any) => ({
    exec: vi.fn().mockResolvedValue(result),
    select: vi.fn().mockReturnThis()
});

(EventModel.findById as any).mockImplementation(() => mockQuery(EVENT));
(EventModel.findOne as any).mockImplementation(() => mockQuery(EVENT));
(UserModel.findById as any).mockImplementation(() => mockQuery(USER));
(UserModel.findOne as any).mockImplementation(() => mockQuery(USER));


describe("Event Controller - Gender Persistence (Unit)", () => {

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset validation mock default
        (validationResult as any).mockReturnValue({
            isEmpty: () => true,
            array: () => []
        });
        (EventModel.findById as any).mockImplementation(() => mockQuery(EVENT));
    });

    it("should save event with gender", async () => {
        const req = {
            body: { ...EVENT, gender: 'female' }
        } as any;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any;

        await addEventController(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(EventModel).toHaveBeenCalledWith(expect.objectContaining({
            gender: 'female'
        }));
    });

    it("should update event with gender", async () => {
        const req = {
            params: { id: '123' },
            body: { data: { gender: 'male' } }
        } as any;

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as any;

        // Ensure findByIdAndUpdate returns a mock that resolves
        (EventModel.findByIdAndUpdate as any).mockImplementation(() => ({
            exec: vi.fn().mockResolvedValue({ ...EVENT, gender: 'male' })
        }));

        await updateEventController(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(EventModel.findByIdAndUpdate).toHaveBeenCalledWith(
            "123",
            expect.objectContaining({ $set: expect.objectContaining({ gender: 'male' }) }),
        );
    });
});
