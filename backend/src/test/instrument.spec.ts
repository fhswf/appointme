
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as Sentry from "@sentry/node";

// Mock dependencies
vi.mock("@sentry/node", () => ({
    init: vi.fn(),
    startSpan: vi.fn((opts, callback) => callback({ end: vi.fn() })),
}));

// Mock dynamic import for profiling
vi.mock("@sentry/profiling-node", () => ({
    nodeProfilingIntegration: vi.fn().mockReturnValue({ name: "ProfilingIntegration" })
}));

describe("Instrument Configuration", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it("should initialize Sentry when SENTRY_DSN is provided", async () => {
        process.env.SENTRY_DSN = "https://examplePublicKey@o0.ingest.sentry.io/0";
        process.env.SENTRY_PROFILING_ENABLED = "true";

        await import("../config/instrument.js");

        expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({
            dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
            tracesSampleRate: 1.0,
            profilesSampleRate: 1.0,
            integrations: expect.arrayContaining([expect.objectContaining({ name: "ProfilingIntegration" })])
        }));
    });

    it("should not initialize Sentry when SENTRY_DSN is missing", async () => {
        delete process.env.SENTRY_DSN;

        await import("../config/instrument.js");

        expect(Sentry.init).not.toHaveBeenCalled();
    });

    it("should skip profiling when SENTRY_PROFILING_ENABLED is false", async () => {
        process.env.SENTRY_DSN = "https://examplePublicKey@o0.ingest.sentry.io/0";
        process.env.SENTRY_PROFILING_ENABLED = "false";

        await import("../config/instrument.js");

        expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({
            dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
            // Should not have profiling integration
            integrations: expect.not.arrayContaining([expect.objectContaining({ name: "ProfilingIntegration" })])
        }));
    });

    it("should catch error if profiling module fails to load", async () => {
        process.env.SENTRY_DSN = "https://examplePublicKey@o0.ingest.sentry.io/0";
        process.env.SENTRY_PROFILING_ENABLED = "true";

        // Force import failure for profiling-node
        vi.doMock("@sentry/profiling-node", () => {
            throw new Error("Failed to load");
        });

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        await import("../config/instrument.js");

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Failed to load @sentry/profiling-node"), expect.any(Error));
        expect(Sentry.init).toHaveBeenCalled(); // Should still init Sentry itself
    });
});
