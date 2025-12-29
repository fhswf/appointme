
import { DAVClient } from 'tsdav';

const THUNDERBIRD_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Thunderbird/115.3.1';

/**
 * Creates a DAVClient instance with pre-configured headers (User-Agent)
 * to ensure compatibility with strict servers (e.g. OpenExchange)
 */
export const createConfiguredDAVClient = (config: ConstructorParameters<typeof DAVClient>[0]): DAVClient => {
    const finalConfig = { ...config };

    // Ensure fetchOptions exists
    if (!finalConfig.fetchOptions) {
        finalConfig.fetchOptions = {};
    }

    // Ensure headers exists
    if (!finalConfig.fetchOptions.headers) {
        finalConfig.fetchOptions.headers = {};
    }

    // Inject User-Agent
    // @ts-ignore
    finalConfig.fetchOptions.headers['User-Agent'] = THUNDERBIRD_USER_AGENT;

    return new DAVClient(finalConfig);
};
