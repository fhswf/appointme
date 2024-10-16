import React, { useState, useEffect } from "react";
import AppNavbar from "../components/AppNavbar";

import { Container, Typography } from "@mui/material";
import { getEventByID, updateEvent } from "../helpers/services/event_services";
import { useNavigate, useParams } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { EventForm } from "../components/EventForm";
import { EMPTY_EVENT, Event } from "common";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

export type EventFormProps = {
  event: Event;
  handleOnSubmit: (evt: Event) => void;
};

const EditEvent = (): JSX.Element => {
  const eventID = useParams<{ id: string }>().id;
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Event>(EMPTY_EVENT);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getEventByID(eventID).then((res) => {
      if (res.data.success === false) {
        signout();
        navigate("/landing");
      } else {
        console.log("editEvent: getEventById returned %o", res.data);
        setFormData(res.data as Event);
      }
    });
  }, [eventID, navigate]);

  const saveEvent = (formData: Event) => {
    updateEvent(eventID, formData)
      .then((res) => {
        if (res.data.success === false) {
          signout();
          navigate("/landing");
        } else {
          enqueueSnackbar(t("happy_caring_fox_spur"), { variant: "success", autoHideDuration: 1500, className: "success" });
          navigate("/app");
        }
      })
      .catch((err) => {
        console.log(err);
        enqueueSnackbar(t("tasty_witty_stingray_hope"), { variant: "error" });
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
