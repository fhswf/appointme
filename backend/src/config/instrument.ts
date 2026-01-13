
import * as Sentry from "@sentry/node";

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
        release: "appointme-backend@" + process.env.npm_package_version,
        dsn: process.env.SENTRY_DSN,
        integrations,
        // Tracing
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Set sampling rate for profiling - this is relative to tracesSampleRate
        profilesSampleRate: 1.0,
    });
}
