import React from "react";

import { useAuthenticated } from "../helpers/helpers";
import { Navigate } from "react-router-dom";

import AppNavbar from "../components/AppNavbar";
import { useTranslation } from "react-i18next";

const Landing = (props: any) => {
  const { t } = useTranslation();
  return (
    <>
      {useAuthenticated() ? <Navigate to="/app" /> : null}
      <AppNavbar />
      <div className="bg-background min-h-screen">
        <div className="container mx-auto p-8">

          <h3 className="text-3xl font-bold mb-4">{t("orange_grand_racoon_fall")}</h3>
          <p className="text-lg mb-6">
            {t("male_patient_hedgehog_ask")}
          </p>
          <ul className="space-y-4">
            <li className="border-b pb-2">
              <div className="font-semibold">Step 1: Configure your calendars</div>
              <div className="text-muted-foreground">{t("factual_moving_hawk_belong")}</div>
            </li>
            <li className="border-b pb-2">
              <div className="font-semibold">{t("pink_polite_racoon_earn")}</div>
              <div className="text-muted-foreground">{t("happy_wise_mantis_laugh")}</div>
            </li>
            <li className="border-b pb-2">
              <div className="font-semibold">{t("careful_misty_bullock_splash")}</div>
              <div className="text-muted-foreground">{t("extra_misty_panda_grip")}</div>
            </li>
            <li className="border-b pb-2">
              <div className="font-semibold">{t("game_frail_vole_treasure")}</div>
              <div className="text-muted-foreground">{t("still_helpful_koala_trust")}</div>
            </li>
          </ul>
        </div>

      </div>
    </>
  );
};

export default Landing;
