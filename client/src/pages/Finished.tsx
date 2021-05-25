import React from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";

import { Button, Container, Link, Paper, Typography } from "@material-ui/core";
import { Event, TimeRange, User } from "@fhswf/bookme-common";
import { useTranslation, Trans } from "react-i18next";

type LocationState = {
  time: TimeRange;
  event: Event;
  user: User;
};

export type FinishedProps = {};

const Finished = (props: FinishedProps) => {
  const location = useLocation<LocationState>();
  const { t, i18n } = useTranslation();
  console.log(location.state);
  const time = location.state.time as TimeRange;
  const event = location.state.event;
  const user = location.state.user;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {t("Confirmation")}
      </Typography>
      <p>
        <Trans i18nKey="confirmationText">
          You booked an appointment with {{ user: user.name }} appointment on{" "}
          {{
            date: time.start.toLocaleDateString(i18n.language, {
              dateStyle: "short",
            }),
          }}
          at
          {{
            time: time.start.toLocaleTimeString(i18n.language, {
              timeStyle: "short",
            }),
          }}
          .
        </Trans>
      </p>
    </Container>
  );
};
export default Finished;
