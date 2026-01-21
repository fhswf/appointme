
import { afterAll, beforeAll, describe, expect, it, vi, beforeEach } from 'vitest';
import request from "supertest";

// Mock dependencies
const mockTokenSet = {
    claims: vi.fn(),
};

vi.mock('openid-client', () => {
    return {
        Configuration: class { },
        buildAuthorizationUrl: vi.fn(),
        authorizationCodeGrant: vi.fn().mockResolvedValue(mockTokenSet),
        ClientSecretBasic: vi.fn(),
        None: vi.fn(),
    };
});

// Mock UserModel
const mockUser = {
    _id: "google-123",
    email: "old@example.com",
    name: "Old Name",
    save: vi.fn().mockResolvedValue(true),
    roles: []
};

const mockFindOne = vi.fn();
const mockFindOneAndUpdate = vi.fn();
const mockFindById = vi.fn();
const mockUpdateOne = vi.fn();

vi.mock("../models/User.js", () => {
    const UserModelMock = {
        findOne: mockFindOne,
        findOneAndUpdate: mockFindOneAndUpdate,
        findById: mockFindById,
        updateOne: mockUpdateOne
    };
    return { UserModel: UserModelMock };
});

vi.mock("../logging.js", () => ({
    logger: {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn(),
    }
}));

// Mock authentication_controller
vi.mock("../controller/authentication_controller.js", () => ({
    validateUrl: (email: string) => email.split('@')[0]
}));

describe("OIDC Security Bug Reproduction", () => {
    let oidcLoginController: any;

    beforeAll(async () => {
        process.env.JWT_SECRET = "test_secret";
        process.env.OIDC_ISSUER = "https://issuer.com";
        process.env.OIDC_CLIENT_ID = "client_id";
        process.env.BASE_URL = "http://localhost";

        // Dynamic import to pick up mocks
        const mod = await import("../controller/oidc_controller.js");
        oidcLoginController = mod.oidcLoginController;
    });

    beforeEach(() => {
        vi.clearAllMocks();
        mockFindOne.mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });
        mockFindOneAndUpdate.mockReturnValue({ exec: vi.fn().mockResolvedValue(mockUser) });
        mockFindById.mockReturnValue({ exec: vi.fn().mockResolvedValue(mockUser) });

        // Reset token mock
        mockTokenSet.claims.mockReturnValue({
            sub: "google-123",
            email: "new@example.com",
            name: "New Name"
        });
    });

    it("reproduces silent email update bug", async () => {
        // Setup scenarios:
        // 1. User exists in DB with _id="google-123" and email="old@example.com".
        // 2. findOrCreatUser searches by email="new@example.com" -> Returns NULL.
        // 3. createNewUser called with sub="google-123".
        // 4. createNewUser does findOneAndUpdate({ _id: "google-123" }, { email: "new@example.com" }, { upsert: true }).
        // 5. This updates the existing user's email silently.

        // Mock findOne for email lookup to return null (not found by new email)
        mockFindOne.mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });

        // Mock findOneAndUpdate to resolve (simulating the upsert succeeding on existing doc)
        mockFindOneAndUpdate.mockReturnValue({
            exec: vi.fn().mockResolvedValue({
                ...mockUser,
                email: "new@example.com"
            })
        });

        const req = {
            body: { code: "auth_code" }
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
            cookie: vi.fn().mockReturnThis()
        };

        await oidcLoginController(req, res);

        // Verify findById was called with SUB
        expect(mockFindById).toHaveBeenCalledWith("google-123");

        // Verify findOne (email lookup) was NOT called (since we found by ID)
        // OR if we mocked findById to return null to test fallback, we'd expect it.
        // In THIS test case, we want to simulate "Found by ID" (user exists with sub), so we expect findById to succeed.
        // We mocked `mockFindById` to return `mockUser` in beforeEach.

        expect(mockFindOne).not.toHaveBeenCalled();

        // Verify findOneAndUpdate (upsert) was NOT called for *email* update.
        // It IS called for updating name/picture via updateExistingUser, but we must ensure email is not in the $set.
        // calculate what we expect:
        // updateExistingUser calls: UserModel.findOneAndUpdate({ _id: user._id }, { $set: update }, ...)
        // update object should only contain name (and maybe picture), NOT email.

        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                $set: expect.objectContaining({ name: "New Name" })
            }),
            expect.anything()
        );

        // Crucial check: Email should NOT be in the $set object
        const updateCall = mockFindOneAndUpdate.mock.calls.find(call => call[0]._id === "google-123");
        if (updateCall) {
            const updateOp = updateCall[1];
            expect(updateOp.$set).not.toHaveProperty("email");
        }

        // Verify updateOne WAS called (via updateUserRoles)
        // updateUserRoles implementation: await UserModel.updateOne({ _id: user._id }, { $addToSet: params }).exec();
        // But roles is empty [], so updateUserRoles returns user immediately if roles is empty? 
        // Let's check logic: if (roles.length > 0) ...
        // In our test, mockUser.roles = [].
        // So updateOne might NOT be called if roles are empty.
        expect(mockUpdateOne).not.toHaveBeenCalled();
    });

    it("falls back to email lookup if ID not found", async () => {
        mockFindById.mockReturnValue({ exec: vi.fn().mockResolvedValue(null) });
        mockFindOne.mockReturnValue({ exec: vi.fn().mockResolvedValue(mockUser) });

        const req = { body: { code: "auth_code" } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn(), cookie: vi.fn().mockReturnThis() };

        await oidcLoginController(req, res);

        expect(mockFindById).toHaveBeenCalledWith("google-123");
        expect(mockFindOne).toHaveBeenCalledWith({ email: "new@example.com" });
    });
});
