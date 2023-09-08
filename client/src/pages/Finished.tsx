import { useLocation } from "react-router-dom";

import { Container, Typography } from "@mui/material";
import { Event, TimeRange, User } from "common";
import { useTranslation, Trans } from "react-i18next";

type LocationState = {
  time: TimeRange;
  event: Event;
  user: User;
};

export type FinishedProps = {};

const Finished = (props: FinishedProps) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  console.log("state: %o", location.state);
  const time = location.state.time as Date;
  const event = location.state.event;
  const user = location.state.user;

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {t("Confirmation")}
      </Typography>
      <Typography variant="body1">
        <Trans i18nKey="confirmationText">
          You booked an {{ event: event?.name }} with {{ name: user.name }} appointment on{" "}
          {{
            date: time?.toLocaleDateString(i18n.language, {
              dateStyle: "short",
            }),
          }}
          at
          {{
            time: time?.toLocaleTimeString(i18n.language, {
              timeStyle: "short",
            }),
          }}
          .
        </Trans>
      </Typography>
    </Container>
  );
};
export default Finished;
