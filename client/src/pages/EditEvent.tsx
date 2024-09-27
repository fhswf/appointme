import React, { useState, useEffect } from "react";
import AppNavbar from "../components/AppNavbar";

import { Container, Typography } from "@mui/material";
import { getEventByID, updateEvent } from "../helpers/services/event_services";
import { useNavigate, useParams } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { EventForm } from "../components/EventForm";
import { EMPTY_EVENT, Event } from "common";
import { useTranslation } from "react-i18next";

export type EventFormProps = {
  event: Event;
  handleOnSubmit: (evt: Event) => void;
};

// export type EditEventProps = RouteComponentProps<{ id: string }> & {};

const EditEvent = (): JSX.Element => {
  const eventID = useParams<{ id: string }>().id;
  const token = JSON.parse(localStorage.getItem("access_token"));
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Event>(EMPTY_EVENT);
  const { t } = useTranslation();

  useEffect(() => {
    getEventByID(token, eventID).then((res) => {
      if (res.data.success === false) {
        signout();
        navigate("/landing");
      } else {
        console.log("editEvent: getEventById returned %o", res.data);
        setFormData(res.data as Event);
      }
    });
  }, [eventID, token, navigate]);

  const saveEvent = (formData: Event) => {
    updateEvent(token, eventID, formData)
      .then((res) => {
        if (res.data.success === false) {
          signout();
          navigate("/landing");
        } else {
          //toast.success(res.data.msg);
          navigate("/app");
        }
      })
      .catch((err) => {
        console.log(err);
        //toast.error("Failed to save event type");
      });
  };

  console.log("render: formData=%o", formData);
  return (
    <>
      <AppNavbar />

      <Container maxWidth="md">
        <Typography component="h1" variant="h3" gutterBottom>
          {t("each_awake_tadpole_jest")}
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
