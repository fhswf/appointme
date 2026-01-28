import * as Sentry from "@sentry/node";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

console.log("SENTRY_PROFILING_ENABLED", process.env.SENTRY_PROFILING_ENABLED);

// Ensure Sentry is initialized if DSN is provided
if (process.env.SENTRY_DSN) {
    const integrations = [];

    if (process.env.SENTRY_PROFILING_ENABLED === "false") {
        console.log("SENTRY_PROFILING_ENABLED is false, skipping profiling");
    } else {
        try {
            const { nodeProfilingIntegration } = await import("@sentry/profiling-node");
            integrations.push(nodeProfilingIntegration());
        } catch (error) {
            console.error("Failed to load @sentry/profiling-node. Profiling will be disabled.", error);
        }
    }

    Sentry.init({
        release: "appointme-mcp@" + packageJson.version,
        environment: process.env.NODE_ENV || 'development',
        dsn: process.env.SENTRY_DSN,
        integrations,
        // Tracing
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Set sampling rate for profiling - this is relative to tracesSampleRate
        profilesSampleRate: 1.0,
    });
}
