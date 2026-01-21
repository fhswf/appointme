import axios from "axios";
import { getCsrfToken } from "./csrf_service";
import { CONFIG } from "../config";

export async function deleteAccess(token) {
  const csrfToken = await getCsrfToken();
  const response = await axios.delete(
    `${CONFIG.API_URL}/google/revoke`,
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
    `${CONFIG.API_URL}/google/generateUrl`,
    {
      withCredentials: true
    }
  );
  return response;
}

export async function getCalendarList() {
  const response = await axios.get(
    `${CONFIG.API_URL}/google/calendarList`,
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
  const start = time.valueOf();
  const csrfToken = await getCsrfToken();
  const response = axios.post(
    `${CONFIG.API_URL}/event/${event_id}/slot`,
    {
      start,
      attendeeName: name,
      attendeeEmail: email,
      description,
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
