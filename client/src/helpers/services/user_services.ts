import axios from "axios";

export async function getUserByToken(token: string) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/users/user`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response;
}

export async function updateUser(token: string, user: any) {
  const response = await axios.put(
    `${process.env.REACT_APP_API_URL}/users/user`,
    { data: user },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response;
}

export async function getUserByUrl(url: string) {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/users/findUserByUrl`,
    {
      params: { url: url },
    }
  );
}
