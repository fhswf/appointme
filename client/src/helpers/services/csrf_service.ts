import axios from "axios";

export async function getCsrfToken() {
    const response = await axios.get(
        `${import.meta.env.REACT_APP_API_URL}/csrf-token`,
        {
            withCredentials: true,
        }
    );
    return response.data.csrfToken;
}
