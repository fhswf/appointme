import axios from "axios";

export async function postToRegister(name, email, password) {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URI}/auth/register`,
    {
      name,
      email,
      password: password,
    }
  );

  return response;
}

export async function postToActivate(token) {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URI}/auth/activate`,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return response;
}

export async function postGoogleLogin(idToken) {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URI}/auth/google_oauth2_oidc`,
    {},
    {
      headers: {
        Authorization: "Bearer " + idToken,
      },
    }
  );

  return response;
}

export async function postLogin(email, password) {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URI}/auth/login`,
    {
      email,
      password: password,
    },
    { withCredentials: true }
  );

  return response;
}
