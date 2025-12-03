import axios from "axios";

export async function getUser() {
  const response = await axios.get(
    `${import.meta.env.REACT_APP_API_URL}/users/user`,
    {
      withCredentials: true,
    }
  );
  return response;
}

import { getCsrfToken } from "./csrf_service";

export async function updateUser(user: any) {
  const csrfToken = await getCsrfToken();
  const response = await axios.put(
    `${import.meta.env.REACT_APP_API_URL}/users/user`,
    { data: user },
    {
      headers: {
        "x-csrf-token": csrfToken,
      },
      withCredentials: true,
    }
  );
  return response;
}

export async function getUserByUrl(url: string) {
  return axios.get(
    `${import.meta.env.REACT_APP_API_URL}/users/user/${url}`,
    {
      params: { url: url },
    }
  );
}
