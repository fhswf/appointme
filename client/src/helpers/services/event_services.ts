import axios from "axios";
import { Event, IntervalSet } from "common";
import { getCsrfToken } from "./csrf_service";

export async function saveUserEvent(
  event: Event,
  userid: string
) {
  const csrfToken = await getCsrfToken();
  const response = await axios.post(
    `${import.meta.env.REACT_APP_API_URL}/event`,
    { ...event, user: userid },
    {
      headers: {
        "x-csrf-token": csrfToken,
      },
      withCredentials: true,
    }
  );
  return response;
}

export async function deleteEvent(id: string) {
  const csrfToken = await getCsrfToken();
  const response = await axios.delete(
    `${import.meta.env.REACT_APP_API_URL}/event/${id}`,
    {
      headers: {
        "x-csrf-token": csrfToken,
      },
      withCredentials: true,
    }
  );

  return response;
}

export async function getEventByID(id: string) {
  const response = await axios.get(
    `${import.meta.env.REACT_APP_API_URL}/event/${id}`,
    {
      withCredentials: true,
    }
  );

  return response;
}

export async function updateEvent(
  id: string,
  event: Event
) {
  console.log('available: %o', event.available);
  const csrfToken = await getCsrfToken();
  const response = await axios.put(
    `${import.meta.env.REACT_APP_API_URL}/event/${id}`,
    {
      data: event
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

export async function getActiveEvents(user_id: string) {
  const response = await axios.get(
    `${import.meta.env.REACT_APP_API_URL}/event/active/${user_id}`
  );
  return response;
}

export function getAvailableTimes(timeMin: Date, timeMax: Date, eventId: string) {
  return axios.get(
    `${import.meta.env.REACT_APP_API_URL}/event/${eventId}/slot`,
    {
      params: {
        timeMin,
        timeMax,
      },
    }
  )
    .then((response) => new IntervalSet(response.data))
}

export async function getUsersEvents() {
  const response = await axios.get(
    `${import.meta.env.REACT_APP_API_URL}/event`,
    {
      withCredentials: true,
    }
  );
  return response;
}

export async function getEventByUrlAndUser(user_id: string, event_url: string) {
  return axios.get(
    `${import.meta.env.REACT_APP_API_URL}/event/${user_id}/${event_url}`
  );
}
