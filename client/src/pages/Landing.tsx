import React from "react";

import { isAuthenticated } from "../helpers/helpers";
import { Navigate } from "react-router-dom";

import AppNavbar from "../components/AppNavbar";
import { Paper, Container, Typography, List, ListItem, ListItemText } from "@mui/material";

const Landing = (props: any) => {
  return (
    <div className="landing">
      {isAuthenticated() ? <Navigate to="/app" /> : null}
      <AppNavbar />
      <Paper>
        <Container>
          <h2>How Bookme works</h2>
          <Typography variant="body1">
            Bookme is a simple, easy to use, appointment booking system. It
            allows you to create events, share your link and let users book
            appointments with you.
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Step 1: Configure your calendars"
                secondary="Specify where BookMe adds your appointments and where it checks whether you are busy." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Step 2: Create events"
                secondary="Add your available times and you're
                good to go!"/>
            </ListItem>
            <ListItem>
              <ListItemText primary="Step 3: Share your link"
                secondary="Users can use this link to book appointments." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Done! Congrats!"
                secondary="Once a user books an appointment, the event is added to your calendar." />
            </ListItem>
          </List>
        </Container>

      </Paper>
    </div>
  );
};

export default Landing;
