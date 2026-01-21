import axios from "axios";
import { CONFIG } from "../config";

export async function getUser() {
  const response = await axios.get(
    `${CONFIG.API_URL}/user/me`,
    {
      withCredentials: true,
    }
  );
  return response;
}

export async function getTransientUser() {
  const response = await axios.get(
    `${CONFIG.API_URL}/user/transient`,
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
    `${CONFIG.API_URL}/user/me`,
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
    `${CONFIG.API_URL}/user/${url}`
  );
}

export async function exportSettings() {
  return axios.get(
    `${CONFIG.API_URL}/user/settings`,
    {
      withCredentials: true,
    }
  );
}

export async function importSettings(data: any) {
  const csrfToken = await getCsrfToken();
  return axios.put(
    `${CONFIG.API_URL}/user/settings`,
    data,
    {
      headers: {
        "x-csrf-token": csrfToken,
      },
      withCredentials: true,
    }
  );
}
