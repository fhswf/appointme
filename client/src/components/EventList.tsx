import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { updateEvent, getUsersEvents } from "../helpers/services/event_services";
import { EventCard } from "./EventCard";
import { EventDocument } from "../helpers/EventDocument";
import { UserDocument } from "../helpers/UserDocument";
import { useTranslation } from "react-i18next";


type EventListProps = {
  url: string;
  user: UserDocument;
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

  return (
    <div
      data-testid="event-list"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          url={props.url}
          hasCalendar={
            !!(props.user.push_calendars && props.user.push_calendars.length > 0)
          }
          defaultAvailable={props.user.defaultAvailable}
          setActive={updateEventStatus}
          onDelete={onDelete}
        />
      ))}

      <button
        onClick={() => navigate("/addevent")}
        className="hidden md:flex group border-2 border-dashed border-border-light dark:border-border-dark rounded-xl flex-col items-center justify-center h-full min-h-[200px] p-6 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200 text-muted-foreground hover:text-primary"
      >
        <div className="bg-muted rounded-full p-4 mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
          {/* Using a Plus icon similar to the mockup */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus text-3xl h-8 w-8"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
        </div>
        <span className="font-medium">{t("new_event_type")}</span>
      </button>
    </div>
  );
};

export default EventList;
