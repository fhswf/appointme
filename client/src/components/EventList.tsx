import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { updateEvent } from "../helpers/services/event_services";

import { Grid } from "@mui/material";


import { getUsersEvents } from "../helpers/services/event_services";
import { EventCard } from "./EventCard";
import { EventDocument } from "../helpers/EventDocument";


type EventListProps = {
  url: string;
  userid: string;
};

const EventList = (props: EventListProps) => {
  const token = JSON.parse(localStorage.getItem("access_token") as string);
  const navigate = useNavigate();

  const [events, setEvents] = useState<EventDocument[]>([]);

  useEffect(() => {
    getUsersEvents(token).then((res) => {
      if (res.data.success === false) {
        signout();
        navigate("/landing");
      } else {
        console.log("events: %o", res.data);
        setEvents(res.data);
      }
    });
  }, [token, navigate]);

  const onDelete = (event: EventDocument) => {
    setEvents(events.filter((ev) => ev._id !== event._id));
  };

  const list =
    events.length === 0 ? (
      <div>No events yet, create one</div>
    ) : (
      events.map((event, index) => (
        <EventCard
          event={event}
          url={props.url}
          setActive={(active) => {
            const event = events[index];
            event.isActive = active;
            console.log("setActive: %o %o", event, active);
            updateEvent(token, event._id, event);
          }}
          token={token}
          onDelete={onDelete}
        />
      ))
    );

  return (
    <>
      <Grid
        container
        spacing={3}
        justifyItems="space-around"
        alignItems="stretch"
      >
        {list}
      </Grid>
    </>
  );
};

export default EventList;
