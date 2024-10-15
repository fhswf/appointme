import { useState, useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import EventList from "../components/EventList";
import AppNavbar from "../components/AppNavbar";

import { Box, Container, Fab, Link, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import AddIcon from "@mui/icons-material/Add";

import { UserContext } from "../components/PrivateRoute";
import { useTranslation } from "react-i18next";

const App = () => {
  const user = useContext(UserContext).user;
  const [connected, setConnected] = useState(false);
  const { t } = useTranslation();


  useEffect(() => {
    if (!user) {
      setConnected(false);
    } else {
      setConnected(true);
    }
  }, [user]);

  const addEventButton = () => {
    if (connected) {
      return (
        <Fab
          variant="extended"
          color="primary"
          aria-label="add"
          href="addevent"
          data-testid="add-event-button"
        >
          <AddIcon sx={{ mr: 1 }} />
          {t("early_sweet_mantis_peek")}
        </Fab>
      );
    } else {
      return (
        <Link component={RouterLink} className="calcon" to="/integration">
          {t("pink_trite_ocelot_enrich")}
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
            {t("low_clean_haddock_bubble")}
          </Typography>
          <Grid container justifyContent="space-between" alignItems="center">
            {user ? (
              <>
                <Grid>
                  <Typography variant="h5">
                    {user.name}
                  </Typography>
                  <br />
                  <Link component={RouterLink} to={"/users/" + user.user_url}>
                    {user.user_url}
                  </Link>
                </Grid>
                <Grid>{addEventButton()}</Grid>
              </>
            ) : (
              <span>{t("deft_suave_bear_pause")}</span>
            )}
          </Grid>
        </Box>

        {renderList()}
      </Container>
    </>
  );
};

export default App;
