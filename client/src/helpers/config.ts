import packageJson from "../../package.json";

declare global {
    interface Window {
        ENV?: {
            [key: string]: string;
        };
    }
}

export const getConfig = (key: string, defaultValue?: string): string => {
    if (globalThis.ENV?.[key]) {
        return globalThis.ENV[key];
    }

    // Also check without REACT_APP_ prefix if it's not found with it (in window.ENV)
    // But strictly speaking we plan to inject REACT_APP_ vars.

    // Fallback to build-time env
    const val = import.meta.env[key];
    if (val !== undefined) {
        return val;
    }

    return defaultValue || "";
};

export const CONFIG = {
    CLIENT_ID: getConfig("REACT_APP_CLIENT_ID"),
    BASE_PATH: getConfig("REACT_APP_BASE_PATH", "/"),
    API_URL: "/api/v1",
    APP_URL: getConfig("REACT_APP_URL"),
    SENTRY_DSN: getConfig("REACT_APP_SENTRY_DSN"),
    ENVIRONMENT: import.meta.env.MODE,
    VERSION: packageJson.version,
};
