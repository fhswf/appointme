
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
    email: "test@example.com",
    name: "Old Name",
    picture_url: "old_pic.jpg",
    save: vi.fn().mockResolvedValue(true),
    roles: [],
    use_gravatar: false
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

describe("OIDC Profile Update Regression", () => {
    let oidcLoginController: any;

    beforeAll(async () => {
        process.env.JWT_SECRET = "test_secret";
        process.env.OIDC_ISSUER = "https://issuer.com";
        process.env.OIDC_CLIENT_ID = "client_id";
        process.env.BASE_URL = "http://localhost";

        const mod = await import("../controller/oidc_controller.js");
        oidcLoginController = mod.oidcLoginController;
    });

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset mock user state if needed
        mockUser.name = "Old Name";
        mockUser.picture_url = "old_pic.jpg";
    });

    it("should update user profile (name function) on login", async () => {
        // Setup: User exists
        mockFindById.mockReturnValue({ exec: vi.fn().mockResolvedValue(mockUser) });

        // Token returns NEW name and NEW picture
        mockTokenSet.claims.mockReturnValue({
            sub: "google-123",
            email: "test@example.com",
            name: "New Name",
            picture: "new_pic.jpg"
        });

        const req = { body: { code: "auth_code" } };
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn(), cookie: vi.fn().mockReturnThis() };

        await oidcLoginController(req, res);

        // Verifications
        // The implementation uses UserModel.findOneAndUpdate to update the user details.
        // It does NOT mutate the user object in memory and call save().

        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            { _id: "google-123" },
            { $set: { name: "New Name", picture_url: "new_pic.jpg" } },
            { new: true, runValidators: true }
        );

        // save() is not called in this flow
        expect(mockUser.save).not.toHaveBeenCalled();
    });
});
