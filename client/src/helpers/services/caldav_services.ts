import axios from "axios";
import { getCsrfToken } from "./csrf_service";
import { CONFIG } from "../config";

export async function addAccount(serverUrl, username, password, name, email) {
    const csrfToken = await getCsrfToken();
    const response = await axios.post(
        `${CONFIG.API_URL}/caldav/account`,
        {
            serverUrl,
            username,
            password,
            name,
            email
        },
        {
            headers: {
                "x-csrf-token": csrfToken,
            },
            withCredentials: true
        }
    );
    return response;
}

export async function removeAccount(id) {
    const csrfToken = await getCsrfToken();
    const response = await axios.delete(
        `${CONFIG.API_URL}/caldav/account/${id}`,
        {
            headers: {
                "x-csrf-token": csrfToken,
            },
            withCredentials: true
        }
    );
    return response;
}

export async function listAccounts() {
    const response = await axios.get(
        `${CONFIG.API_URL}/caldav/account`,
        {
            withCredentials: true
        }
    );
    return response;
}

export async function listCalendars(accountId) {
    const response = await axios.get(
        `${CONFIG.API_URL}/caldav/account/${accountId}/calendars`,
        {
            withCredentials: true
        }
    );
    return response;
}
