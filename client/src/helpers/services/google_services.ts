import axios from "axios";

export async function deleteAccess(token) {
  const response = await axios.delete(
    `${import.meta.env.REACT_APP_API_URL}/google/revoke`,
    {
      data: null,
      withCredentials: true
    }
  );
  return response;
}

export async function getAuthUrl() {
  const response = await axios.get(
    `${import.meta.env.REACT_APP_API_URL}/google/generateUrl`,
    {
      withCredentials: true
    }
  );
  return response;
}

export async function getCalendarList() {
  const response = await axios.get(
    `${import.meta.env.REACT_APP_API_URL}/google/calendarList`,
    {
      withCredentials: true,
    }
  );
  return response;
}

export async function insertIntoGoogle(
  user_id,
  event,
  time,
  name,
  email,
  description
) {
  const starttime = time.valueOf();
  const response = axios.post(
    `${import.meta.env.REACT_APP_API_URL}/google/insertEvent/${user_id}`,
    {
      event,
      starttime,
      name,
      email,
      description,
    }
  );
  return response;
}
