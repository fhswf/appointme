import axios from "axios";
import { Event, IntervalSet } from "@fhswf/bookme-common";

export async function saveUserEvent(
  token: string,
  event: Event,
  userid: string
) {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URI}/events/addEvent`,
    { ...event, user: userid },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response;
}

export async function deleteEvent(token: string, id: string) {
  const response = await axios.delete(
    `${process.env.REACT_APP_API_URI}/events/deleteEvent/${id}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return response;
}

export async function getEventByID(token: string, id: string) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URI}/events/getEvent/${id}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
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
    `${process.env.REACT_APP_API_URI}/events/updateEvent/${id}`,
    {
      data: event
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response;
}

export async function getActiveEvents(user_id: string) {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URI}/events/getActiveEvents`,
    {
      params: { user: user_id },
    }
  );
  return response;
}

export function getAvailableTimes(timeMin: Date, timeMax: Date, url: string, userid: string) {
  return axios.get(
    `${process.env.REACT_APP_API_URI}/events/getAvailable`,
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
    `${process.env.REACT_APP_API_URI}/events/getEvents`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response;
}

export async function getEventByUrlAndUser(user_id: string, event_url: string) {
  return axios.get(
    `${process.env.REACT_APP_API_URI}/events/getEventBy`,
    {
      params: { user: user_id, url: event_url },
    }
  );
}
