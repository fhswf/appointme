import axios from "axios";

export async function postToRegister(name, email, password) {
  const csrfToken = await getCsrfToken();
  const response = await axios.post(
    `${import.meta.env.REACT_APP_API_URL}/auth/register`,
    {
      name,
      email,
      password: password,
    },
    {
      headers: {
        "x-csrf-token": csrfToken,
      },
    }
  );
  return response;
}

export async function postToActivate(token) {
  const csrfToken = await getCsrfToken();
  const response = await axios.post(
    `${import.meta.env.REACT_APP_API_URL}/auth/activate`,
    {},
    {
      headers: {
        "x-csrf-token": csrfToken,
      },
      withCredentials: true,
    }
  );

  return response;
}

import { getCsrfToken } from "./csrf_service";

export async function postGoogleLogin(code) {
  console.log("postGoogleLogin: %s", `${import.meta.env.REACT_APP_API_URL}/auth/google_oauth2_code`);
  const csrfToken = await getCsrfToken();
  const response = await axios.post(
    `${import.meta.env.REACT_APP_API_URL}/auth/google_oauth2_code`,
    {
      code,
    },
    {
      headers: {
        "x-csrf-token": csrfToken,
      },
      withCredentials: true,
    }
  );

  return response;
}

export async function postLogin(email, password) {
  const csrfToken = await getCsrfToken();
  const response = await axios.post(
    `${import.meta.env.REACT_APP_API_URL}/auth/login`,
    {
      email,
      password: password,
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

export async function getOidcConfig() {
  const response = await axios.get(
    `${import.meta.env.REACT_APP_API_URL}/oidc/config`
  );
  return response.data;
}

export async function getOidcAuthUrl() {
  const response = await axios.get(
    `${import.meta.env.REACT_APP_API_URL}/oidc/url`
  );
  return response.data;
}

export async function postOidcLogin(code: string) {
  const csrfToken = await getCsrfToken();
  const response = await axios.post(
    `${import.meta.env.REACT_APP_API_URL}/oidc/login`,
    {
      code,
    },
    {
      headers: {
        "x-csrf-token": csrfToken,
      },
      withCredentials: true,
    }
  );

  return response;
}
// ...
export async function getAuthConfig() {
  const response = await axios.get(
    `${import.meta.env.REACT_APP_API_URL}/auth/config`
  );
  return response.data;
}
