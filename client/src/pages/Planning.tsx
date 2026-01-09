import { useEffect, useState, useMemo } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { getActiveEvents } from "../helpers/services/event_services";
import { getUserByUrl } from "../helpers/services/user_services";
import { EventDocument } from "../helpers/EventDocument";
import { useTranslation } from "react-i18next";
import { PublicEventCard } from "../components/PublicEventCard";
import { toast } from "sonner";
import { User, Event } from "common";
import { ThemeToggle } from "../components/ThemeToggle";
import { FabSpeedDial } from "../components/FabSpeedDial";
import { Button } from "@/components/ui/button";

const Planning = () => {
  const navigate = useNavigate();
  const { user_url } = useParams<{ user_url: string }>();

  const [events, setEvents] = useState<EventDocument[]>([]);
  const [user, setUser] = useState<User | any>({
    name: "",
    welcome: "",
    picture_url: "",
  });

  const [selectedTag, setSelectedTag] = useState<string>("all");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getUserByUrl(user_url)
      .then((res) => {
        if (res.data.length === 0) {
          navigate("/notfound");
        } else {
          setUser(res.data);
          getActiveEvents(res.data._id)
            .then((res) => {
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

  const handleOnClick = (bookingEvent: Event) => {
    navigate(`/users/${user_url}/${bookingEvent.url}`, {
      state: { bookingEvent, user },
    });
  };

  // Derive unique tags from events
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    events.forEach(event => {
      if (event.tags && Array.isArray(event.tags)) {
        event.tags.forEach(tag => tags.add(tag));
      }
    });
    const result = Array.from(tags);
    return result;
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (selectedTag === "all") return events;
    return events.filter(event => event.tags?.includes(selectedTag));
  }, [events, selectedTag]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header Section */}
        <header className="mb-12 text-center max-w-3xl mx-auto">
          {user.picture_url && (
            <div className="inline-flex items-center justify-center p-3 mb-6 bg-white dark:bg-[#1e293b] rounded-full shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-100/10">
              <img
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
                src={user.picture_url}
              />
              <span className="ml-3 text-sm font-medium pr-2">
                {user.name}
              </span>
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {t("Schedule an appointment")}
          </h1>
          <p className="text-lg text-[#6b7280] dark:text-[#94a3b8] leading-relaxed">
            {user.welcome || t("Please select a meeting type to view availability.")}
          </p>
        </header>

        {/* Filter Bar - Conditional Rendering */}
        {uniqueTags.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-6 border-b border-[#e5e7eb] dark:border-[#334155] gap-4">
            <div className="text-sm font-medium text-[#6b7280] dark:text-[#94a3b8]">
              {t("Available Meeting Types")}
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-2 sm:pb-0 no-scrollbar">
              <Button
                variant="ghost"
                onClick={() => setSelectedTag("all")}
                className={`px-3 py-1.5 h-auto rounded-full text-xs font-medium border transition-colors ${selectedTag === "all"
                  ? "bg-white dark:bg-[#1e293b] border-[#e5e7eb] dark:border-[#334155] shadow-sm"
                  : "bg-transparent border-transparent text-[#6b7280] dark:text-[#94a3b8] hover:text-primary dark:hover:text-white"
                  }`}
              >
                {t("All")}
              </Button>
              {uniqueTags.map(tag => (
                <Button
                  key={tag}
                  variant="ghost"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 h-auto rounded-full text-xs font-medium border transition-colors ${selectedTag === tag
                    ? "bg-white dark:bg-[#1e293b] border-[#e5e7eb] dark:border-[#334155] shadow-sm"
                    : "bg-transparent border-transparent text-[#6b7280] dark:text-[#94a3b8] hover:text-primary dark:hover:text-white"
                    }`}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredEvents.map((event, index) => (
            <PublicEventCard
              key={event._id || index}
              event={event}
              user={user}
              onClick={handleOnClick}
              index={index}
            />
          ))}
        </div>

        {events.length === 0 && (
          <h4 className="text-xl font-semibold text-center mt-12 text-muted-foreground">
            {t("No public events found.")}
          </h4>
        )}


        {/* Footer */}
        <div className="mt-16 text-center border-t border-[#e5e7eb] dark:border-[#334155] pt-8">
          <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
            {t("Timezone")}: <span className="font-medium text-[#1f2937] dark:text-[#f8fafc]">
              {new Intl.DateTimeFormat(i18n.language, { timeZoneName: 'short' }).formatToParts(new Date()).find((part) => part.type === 'timeZoneName')?.value} ({new Date().toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })})
            </span>
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            {/* Placeholders for legal links if needed, or link to /legal which exists in routing */}
            <a className="text-[#6b7280] dark:text-[#94a3b8] hover:text-primary dark:hover:text-white transition-colors text-sm" href="/legal">
              {t("Privacy & Terms")}
            </a>
            <span className="text-[#6b7280] dark:text-[#94a3b8] text-sm">
              {t("footer_credits")}
            </span>
          </div>
        </div>
      </div>

      <FabSpeedDial
        className="bg-white dark:bg-[#1e293b] border border-[#e5e7eb] dark:border-[#334155] hover:scale-110 hover:bg-gray-50 dark:hover:bg-[#334155] text-foreground"
      />
    </div>
  );
};

export default Planning;
