import React, { useState, useEffect } from "react";
import AppNavbar from "../components/AppNavbar";

import { getEventByID, updateEvent } from "../helpers/services/event_services";
import { useNavigate, useParams } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { EventForm } from "../components/EventForm";
import { EMPTY_EVENT, Event } from "common";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";

export type EventFormProps = {
  event: Event;
  handleOnSubmit: (evt: Event) => void;
};

const EditEvent = (): JSX.Element => {
  const eventID = useParams<{ id: string }>().id;
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Event>(EMPTY_EVENT);
  const { t } = useTranslation();

  useEffect(() => {
    getEventByID(eventID).then((res) => {
      if (res.data.success === false) {
        signout();
        navigate("/landing");
      } else {
        console.log("editEvent: getEventById returned %o", res.data);
        setFormData(res.data as Event);
      }
    });
  }, [eventID, navigate]);

  const saveEvent = (formData: Event) => {
    updateEvent(eventID, formData)
      .then((res) => {
        if (res.data.success === false) {
          signout();
          navigate("/landing");
        } else {
          toast.success(t("happy_caring_fox_spur"));
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(t("tasty_witty_stingray_hope"));
      });
  };

  console.log("render: formData=%o", formData);
  return (
    <>
      <AppNavbar />

      <div className="container mx-auto p-4 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            {t("each_awake_tadpole_jest")}
          </h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <EventForm
              event={formData || EMPTY_EVENT}
              handleOnSubmit={saveEvent}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EditEvent;
