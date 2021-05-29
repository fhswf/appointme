import React, { useState, useContext, useEffect } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import EventList from "../components/EventList";
import AppNavbar from "../components/AppNavbar";

import { Box, Container, Fab, Grid, Link, Typography } from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";

import { UserContext } from "../components/PrivateRoute";

const App = () => {
  const history = useHistory();
  const user = useContext(UserContext).user;
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user || !user.google_tokens || !user.google_tokens.access_token) {
      setConnected(false);
    } else {
      setConnected(true);
    }
  }, [user]);

  const addEventButton = () => {
    if (connected) {
      return (
        <>
          <Fab
            variant="extended"
            color="primary"
            aria-label="add"
            href="addevent"
          >
            <AddIcon sx={{ mr: 1 }} />
            Add event type
          </Fab>
        </>
      );
    } else {
      return (
        <Link component={RouterLink} className="calcon" to="integration">
          You need to connect your Calendar first, before you can add Events!
        </Link>
      );
    }
  };

  const renderList = () => {
    if (user && connected) {
      return <EventList url={user.user_url} userid={user._id} />;
    }
  };

  console.log("App: user=%o", user);
  return (
    <>
      <AppNavbar />
      <Container>
        <Box p="1em">
          <Typography variant="h3" gutterBottom>
            My Event Types
          </Typography>
          <Grid container justifyContent="space-between" alignItems="center">
            {user ? (
              <>
                <Grid item>
                  {user.name}
                  <br />
                  <Link component={RouterLink} to={"/users/" + user.user_url}>
                    {history.createHref({
                      pathname: `/users/${user.user_url}`,
                    })}
                  </Link>
                </Grid>
                <Grid item>{addEventButton()}</Grid>
              </>
            ) : (
              <span>Loading</span>
            )}
          </Grid>
        </Box>

        <Box p="1em">{renderList()}</Box>
      </Container>
    </>
  );
};

export default App;
