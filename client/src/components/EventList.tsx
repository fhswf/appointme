import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { updateEvent, getUsersEvents } from "../helpers/services/event_services";
import { EventCard } from "./EventCard";
import { EventDocument } from "../helpers/EventDocument";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";


type EventListProps = {
  url: string;
};

const EventList = (props: EventListProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();


  const [events, setEvents] = useState<EventDocument[]>([]);

  useEffect(() => {
    getUsersEvents().then((res) => {
      if (res.data.success === false) {
        signout();
        navigate("/landing");
      } else {
        console.log("events: %o", res.data);
        setEvents(res.data);
      }
    });
  }, [navigate]);

  const onDelete = (event: EventDocument) => {
    setEvents(events.filter((ev) => ev._id !== event._id));
  };

  const updateEventStatus = (event: EventDocument, active: boolean): void => {
    console.log("setActive: %o %o", event, active);
    event.isActive = active;
    updateEvent(event._id, event);
  };

  const list =
    events.length === 0 ? (
      <div className="flex flex-wrap items-center justify-start gap-4 col-span-full">
        <p className="text-muted-foreground">{t("sunny_great_halibut_empower")}</p>
        <Button onClick={() => navigate("/addevent")}>
          {t("create_first_event_type_button")}
        </Button>
      </div>
    ) : (
      events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          url={props.url}
          setActive={updateEventStatus}
          onDelete={onDelete}
        />
      ))
    );

  return (
    <div
      data-testid="event-list"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {list}
    </div>
  );
};

export default EventList;
