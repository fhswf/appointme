import axios from "axios";

export async function deleteAccess(token) {
  const response = await axios.delete(
    `${process.env.API_URL}/google/revoke`,
    {
      data: null,
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response;
}

export async function getAuthUrl(token) {
  const response = await axios.get(
    `${process.env.API_URL}/google/generateUrl`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response;
}

export async function getCalendarList(token) {
  const response = await axios.get(
    `${process.env.API_URL}/google/calendarList`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
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
    `${process.env.API_URL}/google/insertEvent/${user_id}`,
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
