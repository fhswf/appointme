import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardContent,
  Container,
  Grid,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

import { getActiveEvents } from "../helpers/services/event_services";
import { getUserByUrl } from "../helpers/services/user_services";
import { EventDocument } from "../helpers/EventDocument";
import { useTranslation } from "react-i18next";
import { EventType } from "../components/EventType";


const Planning = (props: any) => {
  const navigate = useNavigate();

  const { user_url } = useParams<{ user_url: string }>();
  const [events, setEvents] = useState<EventDocument[]>([]);
  const [user, setUser] = useState({
    name: "",
    welcome: "",
    picture_url: "",
  });
  const { t } = useTranslation();

  useEffect(() => {
    getUserByUrl(user_url)
      .then((res) => {
        if (res.data.length === 0) {
          navigate("/notfound");
        } else {
          setUser(res.data);
          getActiveEvents(res.data._id)
            .then((res) => {
              console.log(res.data);
              if (res.data.length === 0) {
                setUser({
                  name: user.name,
                  welcome: "No active Events",
                  picture_url: "",
                });
              } else {
                setEvents(res.data);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user_url, navigate, user.name]);

  const handleOnClick = (bookingEvent: EventDocument) => {
    navigate(`/users/${user_url}/${bookingEvent.url}`, {
      state: { bookingEvent, user },
    });
  };

  const renderEventlist = () => {
    if (!events || events.length === 0) {
      return <h4 className="noevents">{t("extra_patient_warbler_praise")}</h4>;
    } else {
      return (
        <Grid
          container
          spacing={3}
          direction="row"
          justifyContent="space-evenly"
          alignItems="stretch"
        >
          {events.map((event, index) => (
            <Grid item sm={4} xs={6} key={index}>
              <EventType
                event={event}
                user={user}
                handleOnClick={handleOnClick} />
            </Grid>
          ))}
        </Grid>
      );
    }
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        {t("broad_close_butterfly_drop", { name: user.name })}
      </Typography>
      {t("weary_known_gazelle_file")}
      <Box p="1em">{renderEventlist()}</Box>
    </Container>
  );
};

export default Planning;
