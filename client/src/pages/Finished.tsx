import React from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";

import { Button, Container, Link, Paper, Typography } from "@material-ui/core";
import { Event } from "@fhswf/bookme-common";

type LocationState = {
  time: Date;
  event: Event;
};

export type FinishedProps = {};

const Finished = (props: FinishedProps) => {
  const location = useLocation<LocationState>();
  console.log(location.state);
  const time = location.state.time;
  const event = location.state.event;

  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Success
      </Typography>
      <p>
        You booked a <em>{event.name}</em> appointment on{" "}
        {time.toLocaleDateString()} at {time.toLocaleTimeString()}.
      </p>
      <p>
        Thank you for using{" "}
        <Link component={RouterLink} to="/landing">
          Bookme!
        </Link>
      </p>
    </Container>
  );
};
export default Finished;
