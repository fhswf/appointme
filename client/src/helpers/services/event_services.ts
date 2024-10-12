import axios from "axios";
import { Event, IntervalSet } from "common";

export async function saveUserEvent(
  token: string,
  event: Event,
  userid: string
) {
  const response = await axios.post(
    `${import.meta.env.REACT_APP_API_URL}/events/addEvent`,
    { ...event, user: userid },
    {
      withCredentials: true,
    }
  );
  return response;
}

export async function deleteEvent(token: string, id: string) {
  const response = await axios.delete(
    `${import.meta.env.REACT_APP_API_URL}/events/deleteEvent/${id}`,
    {
      withCredentials: true,
    }
  );

  return response;
}

export async function getEventByID(token: string, id: string) {
  const response = await axios.get(
    `${import.meta.env.REACT_APP_API_URL}/events/getEvent/${id}`,
    {
      withCredentials: true,
    }
  );

  return response;
}

export async function updateEvent(
  token: string,
  id: string,
  event: Event
) {
  console.log('available: %o', event.available);
  const response = await axios.put(
    `${import.meta.env.REACT_APP_API_URL}/events/updateEvent/${id}`,
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

export async function getUsersEvents(token: string) {
  const response = await axios.get(
    `${import.meta.env.REACT_APP_API_URL}/events/getEvents`,
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
