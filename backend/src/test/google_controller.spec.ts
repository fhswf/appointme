import { vi, describe, it, expect, beforeEach } from 'vitest';
import { googleCallback } from '../controller/google_controller';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { UserModel } from '../models/User';

// Mock dependencies
vi.mock('../models/User', () => ({
    UserModel: {
        findOneAndUpdate: vi.fn().mockResolvedValue({})
    }
}));

const mockGetToken = vi.fn();
const mockSetCredentials = vi.fn();
const mockOn = vi.fn();
const mockGenerateAuthUrl = vi.fn();

vi.mock('googleapis', () => ({
    google: {
        calendar: vi.fn()
    }
}));

vi.mock('google-auth-library', () => {
    return {
        OAuth2Client: vi.fn().mockImplementation(function () {
            return {
                getToken: mockGetToken,
                setCredentials: mockSetCredentials,
                on: mockOn,
                generateAuthUrl: mockGenerateAuthUrl,
                revokeToken: vi.fn().mockResolvedValue(true)
            };
        })
    };
});

// Mock logger
vi.mock('../logging', () => ({
    logger: {
        debug: vi.fn(),
        error: vi.fn()
    }
}));

describe('google_controller', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should save tokens with dot notation when googleCallback is called', async () => {
        const req = {
            query: {
                code: 'auth_code',
                state: 'user_id'
            }
        } as unknown as Request;

        const res = {
            redirect: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;

        mockGetToken.mockResolvedValue({
            tokens: {
                access_token: 'new_access_token',
                // No refresh token
                expiry_date: 123456789
            }
        });

        await googleCallback(req, res);

        // Wait for promises to resolve
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: { $eq: 'user_id' } },
            {
                $set: {
                    'google_tokens.access_token': 'new_access_token',
                    'google_tokens.expiry_date': 123456789
                }
            },
            { new: true }
        );
    });

    it('should create a new OAuth2Client instance', async () => {
        const req = {
            query: {
                code: 'auth_code',
                state: 'user_id'
            }
        } as unknown as Request;

        const res = {
            redirect: vi.fn(),
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        } as unknown as Response;

        mockGetToken.mockResolvedValue({ tokens: {} });

        await googleCallback(req, res);

        expect(OAuth2Client).toHaveBeenCalled();
    });
});
