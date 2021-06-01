import React, { useState, useEffect } from "react";
import AppNavbar from "../components/AppNavbar";

import { Container, Typography } from "@material-ui/core";

import { toast } from "react-toastify";
import { getEventByID, updateEvent } from "../helpers/services/event_services";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { EventForm } from "../components/EventForm";
import { EMPTY_EVENT, Event } from "@fhswf/bookme-common";

export type EventFormProps = {
  event: Event;
  handleOnSubmit: (evt: Event) => void;
};

export type EditEventProps = RouteComponentProps<{ id: string }> & {};

const EditEvent = (props: EditEventProps): JSX.Element => {
  const eventID = props.match.params.id;
  const token = JSON.parse(localStorage.getItem("access_token"));
  const history = useHistory();
  const [formData, setFormData] = useState<Event>(EMPTY_EVENT);

  useEffect(() => {
    getEventByID(token, eventID).then((res) => {
      if (res.data.success === false) {
        signout();
        history.push("/landing");
      } else {
        console.log("editEvent: getEventById returned %o", res.data);
        setFormData(res.data as Event);
      }
    });
  }, [eventID, token, history]);

  const saveEvent = (formData: Event) => {
    updateEvent(token, eventID, formData)
      .then((res) => {
        if (res.data.success === false) {
          signout();
          history.push("/landing");
        } else {
          toast.success(res.data.msg);
          history.push("/app");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to save event type");
      });
  };

  console.log("render: formData=%o", formData);
  return (
    <>
      <AppNavbar />

      <Container maxWidth="md">
        <Typography component="h1" variant="h3" gutterBottom>
          Edit Event Type
        </Typography>
        <EventForm
          event={formData ? formData : EMPTY_EVENT}
          handleOnSubmit={saveEvent}
        />
      </Container>
    </>
  );
};

export default EditEvent;
