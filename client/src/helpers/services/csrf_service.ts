import axios from "axios";
import { CONFIG } from "../config";

export async function getCsrfToken() {
    const response = await axios.get(
        `${CONFIG.API_URL}/csrf-token`,
        {
            withCredentials: true,
        }
    );
    return response.data.csrfToken;
}
