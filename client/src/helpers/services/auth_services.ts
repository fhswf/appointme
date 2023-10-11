import axios from "axios";

export async function postToRegister(name, email, password) {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/auth/register`,
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
    `${process.env.REACT_APP_API_URL}/auth/activate`,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return response;
}

export async function postGoogleLogin(code) {
  console.log("postGoogleLogin: %s", `${process.env.REACT_APP_API_URL}/auth/google_oauth2_code`);
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/auth/google_oauth2_code`,
    {
      code,
    },
    {
    }
  );

  return response;
}

export async function postLogin(email, password) {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/auth/login`,
    {
      email,
      password: password,
    },
    { withCredentials: true }
  );

  return response;
}
