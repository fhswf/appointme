import axios from "axios";
import { Event, IntervalSet } from "common";

export async function saveUserEvent(
  event: Event,
  userid: string
) {
  const response = await axios.post(
    `${import.meta.env.REACT_APP_API_URL}/events/event`,
    { ...event, user: userid },
    {
      withCredentials: true,
    }
  );
  return response;
}

export async function deleteEvent(id: string) {
  const response = await axios.delete(
    `${import.meta.env.REACT_APP_API_URL}/events/event/${id}`,
    {
      withCredentials: true,
    }
  );

  return response;
}

export async function getEventByID(id: string) {
  const response = await axios.get(
    `${import.meta.env.REACT_APP_API_URL}/events/event/${id}`,
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
  const response = await axios.put(
    `${import.meta.env.REACT_APP_API_URL}/events/event/${id}`,
    {
      data: event
    },
    {
      withCredentials: true,
    }
  );
  return response;
}

export async function getActiveEvents(user_id: string) {
  const response = await axios.get(
    `${import.meta.env.REACT_APP_API_URL}/events/getActiveEvents`,
    {
      params: { user: user_id },
    }
  );
  return response;
}

export function getAvailableTimes(timeMin: Date, timeMax: Date, url: string, userid: string) {
  console.log("getAvailableTimes called", { timeMin, timeMax, url, userid });
  return axios.get(
    `${import.meta.env.REACT_APP_API_URL}/events/getAvailable`,
    {
      params: {
        timeMin,
        timeMax,
        url,
        userid,
      },
    }
  )
    .then((response) => new IntervalSet(response.data))
}

export async function getUsersEvents() {
  const response = await axios.get(
    `${import.meta.env.REACT_APP_API_URL}/events/event`,
    {
      withCredentials: true,
    }
  );
  return response;
}

export async function getEventByUrlAndUser(user_id: string, event_url: string) {
  return axios.get(
    `${import.meta.env.REACT_APP_API_URL}/events/getEventBy`,
    {
      params: { user: user_id, url: event_url },
    }
  );
}
