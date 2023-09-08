/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { signout } from "../helpers/helpers";

import { Container } from "@mui/material";
import { makeStyles } from "@mui/styles";

import AppNavbar from "../components/AppNavbar";
import { saveUserEvent } from "../helpers/services/event_services";
import { EMPTY_EVENT, Event } from "common";
import { EventForm } from "../components/EventForm";
import { UserContext } from "../components/PrivateRoute";

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
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("access_token") as string);
  const [formData, setFormData] = useState(EMPTY_EVENT);
  const user = useContext(UserContext).user;

  const saveEvent = (formData: Event) => {
    if (user) {
      saveUserEvent(token, formData, user._id)
        .then((res) => {
          if (res.data.success === false) {
            signout();
            navigate("/landing");
          } else {
            toast.success(res.data.msg);
            navigate("/app");
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
