import React from "react";

import { isAuthenticated } from "../helpers/helpers";
import { Navigate } from "react-router-dom";

import AppNavbar from "../components/AppNavbar";
import { Paper, Container, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";

const Landing = (props: any) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="landing">
      {isAuthenticated() ? <Navigate to="/app" /> : null}
      <AppNavbar />
      <Paper>
        <Container>

          <Typography variant="h3">{t("orange_grand_racoon_fall")}</Typography>
          <Typography variant="body1">
            {t("male_patient_hedgehog_ask")}
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Step 1: Configure your calendars"
                secondary={t("factual_moving_hawk_belong")} />
            </ListItem>
            <ListItem>
              <ListItemText primary={t("pink_polite_racoon_earn")}
                secondary={t("happy_wise_mantis_laugh")} />
            </ListItem>
            <ListItem>
              <ListItemText primary={t("careful_misty_bullock_splash")}
                secondary={t("extra_misty_panda_grip")} />
            </ListItem>
            <ListItem>
              <ListItemText primary={t("game_frail_vole_treasure")}
                secondary={t("still_helpful_koala_trust")} />
            </ListItem>
          </List>
        </Container>

      </Paper>
    </div>
  );
};

export default Landing;
