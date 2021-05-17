import axios from "axios";

export async function getUserByToken(token: string) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URI}/users/user`,
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
    `${process.env.REACT_APP_API_URI}/users/user`,
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
  const response = await axios.get(
    `${process.env.REACT_APP_API_URI}/users/findUserByUrl`,
    {
      params: { url: url },
    }
  );
  return response;
}
