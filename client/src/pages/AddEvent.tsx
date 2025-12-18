/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signout } from "../helpers/helpers";

import AppNavbar from "../components/AppNavbar";
import { saveUserEvent } from "../helpers/services/event_services";
import { EMPTY_EVENT, Event } from "common";
import { EventForm } from "../components/EventForm";
import { UserContext } from "../components/PrivateRoute";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";


import { Card, CardContent } from "@/components/ui/card";

type AddEventProps = {};

const AddEvent = (props: AddEventProps) => {
  const navigate = useNavigate();
  const [formData] = useState(EMPTY_EVENT);
  const user = useContext(UserContext).user;
  const { t } = useTranslation();

  const saveEvent = (formData: Event) => {
    if (user) {
      saveUserEvent(formData, user._id)
        .then((res) => {
          if (res.data.success === false) {
            signout();
            navigate("/landing");
          } else {
            toast.success(t("best_due_parakeet_zip"));
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error(t("steep_fine_lobster_inspire"));
        });
    }
  };


  return (
    <>
      <AppNavbar></AppNavbar>
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t("Add Event Type")}</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <EventForm event={formData} handleOnSubmit={saveEvent} data-testid="event-form" />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AddEvent;
