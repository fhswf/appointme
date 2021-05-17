import React, { useState, useEffect } from "react";
import AppNavbar from "../components/AppNavbar";

import "../styles/addevent.css";
import {
  Card,
  Container,
  FormGroup,
  FormLabel,
  Input,
  Paper,
} from "@material-ui/core";

import Switch from "@material-ui/core/Switch";
import { toast } from "react-toastify";
import { getEventByID, updateEvent } from "../helpers/services/event_services";
import { useHistory } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { EventForm } from "../components/EventForm";
import { Day, EMPTY_EVENT, Event, Slot } from "@fhswf/bookme-common";

export type EventFormProps = {
  event: Event;
  handleOnSubmit: (evt: Event) => void;
};

const EditEvent = ({ match }): JSX.Element => {
  const eventID = match.params.id;
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
        <h2>Edit Event Type</h2>
        <EventForm
          event={formData ? formData : EMPTY_EVENT}
          handleOnSubmit={saveEvent}
        />
      </Container>
    </>
  );
};

export default EditEvent;
