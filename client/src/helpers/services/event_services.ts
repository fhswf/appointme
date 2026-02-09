import axios from "axios";
import { Event, IntervalSet } from "common";
import { getCsrfToken } from "./csrf_service";
import { CONFIG } from "../config";

export async function saveUserEvent(
  event: Event,
  userid: string
) {
  const csrfToken = await getCsrfToken();
  const response = await axios.post(
    `${CONFIG.API_URL}/event`,
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
    `${CONFIG.API_URL}/event/${id}`,
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
    `${CONFIG.API_URL}/event/${id}`,
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
    `${CONFIG.API_URL}/event/${id}`,
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
    `${CONFIG.API_URL}/event/active/${user_id}`
  );
  return response;
}

export function getAvailableTimes(timeMin: Date, timeMax: Date, eventId: string) {
  return axios.get(
    `${CONFIG.API_URL}/event/${eventId}/slot`,
    {
      params: {
        timeMin,
        timeMax,
      },
    }
  )
    .then((response) => {
      if (Array.isArray(response.data)) {
        return { slots: new IntervalSet(response.data) };
      }
      return {
        slots: new IntervalSet(response.data.slots || []),
        message: response.data.message as string
      };
    })
}

export async function getUsersEvents() {
  const response = await axios.get(
    `${CONFIG.API_URL}/event`,
    {
      withCredentials: true,
    }
  );
  return response;
}

export async function getEventByUrlAndUser(user_id: string, event_url: string) {
  return axios.get(
    `${CONFIG.API_URL}/event/${user_id}/${event_url}`
  );
}
