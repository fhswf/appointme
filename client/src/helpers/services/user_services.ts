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

export async function updateUser(user: any) {
  const response = await axios.put(
    `${import.meta.env.REACT_APP_API_URL}/users/user`,
    { data: user },
    {
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
