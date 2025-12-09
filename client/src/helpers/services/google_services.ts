import axios from "axios";
import { getCsrfToken } from "./csrf_service";

export async function deleteAccess(token) {
  const csrfToken = await getCsrfToken();
  const response = await axios.delete(
    `${import.meta.env.REACT_APP_API_URL}/google/revoke`,
    {
      data: null,
      headers: {
        "x-csrf-token": csrfToken,
      },
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

export async function insertEvent(
  event_id,
  time,
  name,
  email,
  description
) {
  const starttime = time.valueOf();
  const response = axios.post(
    `${import.meta.env.REACT_APP_API_URL}/event/${event_id}/slot`,
    {
      starttime,
      name,
      email,
      description,
    }
  );
  return response;
}
