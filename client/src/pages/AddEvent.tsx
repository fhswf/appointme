/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { signout } from "../helpers/helpers";

import { Container } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { makeStyles } from "@material-ui/core/styles";

import AppNavbar from "../components/AppNavbar";
import { saveUserEvent } from "../helpers/services/event_services";
import { TimesForDay } from "../components/TimesForDay";
import { Day, EMPTY_EVENT, Event, Slot } from "@fhswf/bookme-common";
import { EventForm } from "../components/EventForm";
import { UserContext } from "../helpers/PrivateRoute";

export const useStyles = makeStyles((theme) => ({
  row: {
    alignItems: "baseline",
  },
  label: {
    fontSize: "0.7rem",
    display: "block",
    paddingTop: "2ex",
    marginBottom: "-1ex",
  },
  sep: {
    padding: "0.8ex",
  },
}));

type AddEventProps = {};

const AddEvent = (props: AddEventProps) => {
  const history = useHistory();
  const token = JSON.parse(localStorage.getItem("access_token") as string);
  const [formData, setFormData] = useState(EMPTY_EVENT);
  const user = useContext(UserContext).user;

  const saveEvent = (formData: Event) => {
    if (user) {
      saveUserEvent(token, formData, user._id)
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
    }
  };

  const theme = {
    spacing: (value: number) => value * 2,
  };

  return (
    <>
      <AppNavbar></AppNavbar>
      <Container maxWidth="md">
        <h2>Add Event Type</h2>
        <EventForm event={formData} handleOnSubmit={saveEvent} />
      </Container>
    </>
  );
};

export default AddEvent;
