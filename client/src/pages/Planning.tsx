import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { getActiveEvents } from "../helpers/services/event_services";
import { getUserByUrl } from "../helpers/services/user_services";
import { EventDocument } from "../helpers/EventDocument";
import { useTranslation } from "react-i18next";
import { EventType } from "../components/EventType";
import { toast } from "sonner";
import { User } from "common";


const Planning = (props: any) => {
  const navigate = useNavigate();

  const { user_url } = useParams<{ user_url: string }>();
  const [events, setEvents] = useState<EventDocument[]>([]);

  // ...

  const [user, setUser] = useState<User | any>({
    name: "",
    welcome: "",
    picture_url: "",
  });
  const { t } = useTranslation();

  useEffect(() => {
    getUserByUrl(user_url)
      .then((res) => {
        if (res.data.length === 0) {
          navigate("/notfound");
        } else {
          setUser(res.data);
          getActiveEvents(res.data._id)
            .then((res) => {
              console.log(res.data);
              setEvents(res.data);
            })
            .catch((err) => {
              toast.error("Could not get event information");
              console.log(err);
            });
        }
      })
      .catch((err) => {
        toast.error("Could not get user information");
        console.log(err);
      });
  }, [user_url, navigate]);

  const handleOnClick = (bookingEvent: EventDocument) => {
    navigate(`/users/${user_url}/${bookingEvent.url}`, {
      state: { bookingEvent, user },
    });
  };

  const renderEventlist = () => {
    if (!events || events.length === 0) {
      return <h4 className="text-xl font-semibold text-center mt-8">{t("extra_patient_warbler_praise")}</h4>;
    } else {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id}>
              <EventType
                event={event}
                user={user}
                time={undefined}
                handleOnClick={handleOnClick} />
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-3xl font-bold mb-4">
        {t("broad_close_butterfly_drop", { name: user.name })}
      </h3>
      <p className="mb-4">{t("weary_known_gazelle_file")}</p>
      <div className="p-4">{renderEventlist()}</div>
    </div>
  );
};

export default Planning;
