import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { deleteEvent } from "../helpers/services/event_services";
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash, Copy, Clock } from "lucide-react";
import { EventDocument } from "../helpers/EventDocument";
import { Slots, Slot } from "common";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import "./EventCard.css";

type EventCardProps = {
  event: EventDocument;
  url: string;
  hasCalendar: boolean;
  defaultAvailable?: Slots;
  setActive: (event: EventDocument, active: boolean) => void;
  onDelete: (event: EventDocument) => void;
};

export const EventCard = (props: EventCardProps) => {
  const [active, setActive] = useState(props.event.isActive);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const event = props.event;

  const toggleActive = (checked: boolean) => {
    if (checked) {
      if (!props.hasCalendar) {
        toast.error(t("error_no_calendar"));
        return;
      }
      if (event.duration <= 0) {
        toast.error(t("error_no_duration"));
        return;
      }
      const slots = event.availabilityMode === 'default' ? props.defaultAvailable : event.available;
      const hasSlots = slots && Object.values(slots).some((daySlots: Slot[]) => daySlots.length > 0);
      if (!hasSlots) {
        toast.error(t("error_no_slots"));
        return;
      }
    }
    setActive(checked);
    props.setActive(event, checked);
  };

  const handleCopy = () => {
    const loc = globalThis.location;
    let url = `/users/${props.url}/${props.event.url}`;
    url = loc.protocol + "//" + loc.host + url;
    console.log("url: %s", url);

    navigator.clipboard
      .writeText(url)
      .then(() => toast.success(t("link_copied_to_clipboard")))
      .catch((err) => {
        console.log("err: %o", err);
        toast.error(t("link_copy_failed"));
      });
  };

  const handleDelete = () => {
    deleteEvent(props.event._id)
      .then((res) => {
        if (res.data.success === false) {
          navigate("/landing");
        }
      })
      .catch((error_) => {
        console.error("deleteEvent failed: %o", error_);
        navigate("/landing");
      });
    if (props.onDelete) {
      props.onDelete(props.event);
    }
  };

  return (
    <Card
      className={`group rounded-xl hover:shadow-md transition-all duration-200 flex flex-col h-full relative overflow-hidden ${active ? "ring-1 ring-primary/5 border-primary/20 md:shadow-lg md:shadow-blue-500/10 active" : "inactive"}`}
      data-testid="event-card"
    >
      {/* Left border strip - hidden on mobile */}
      <div className={`hidden sm:block absolute top-0 left-0 w-0.5 h-full transition-colors ${active ? "bg-blue-500" : "bg-muted-foreground/20 group-hover:bg-blue-500/50"}`}></div>

      <CardContent className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold truncate pr-4">{props.event.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary h-8 w-8 -mr-2"
            title={t("edit")}
            asChild
            data-testid="edit-event-button"
          >
            <RouterLink to={`/editevent/${props.event._id}`}>
              <Edit className="h-5 w-5" />
            </RouterLink>
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Clock className="h-4 w-4" />
          <span>{props.event.duration} min</span>
          {props.event.recurrence?.enabled && (
            <span>
              • {t("Recurring")}: {t(props.event.recurrence.frequency)}
            </span>
          )}
        </div>



        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {props.event.description}
        </p>

        {(props.event.tags && props.event.tags.length > 0) || (props.event.allowed_roles && props.event.allowed_roles.includes("student")) ? (
          <div className="flex flex-wrap gap-2 mt-4">
            {props.event.allowed_roles?.includes("student") && (
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-md text-xs font-medium border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                {t("Student Only")}
              </span>
            )}
            {props.event.tags && props.event.tags.map((tag) => (
              <span key={tag} className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs font-medium border border-border">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="px-5 py-4 border-t border-border bg-muted/30 justify-between">
        <label className="flex items-center cursor-pointer gap-2">
          <Switch
            checked={active}
            onCheckedChange={toggleActive}
            data-testid="active-switch"
            aria-label="active"
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
          />
          <span className={`hidden sm:block text-xs font-medium ${active ? "text-primary font-bold" : "text-muted-foreground"}`}>
            {active ? t("Active") : t("Inactive")}
          </span>
        </label>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-2 py-1.5 h-auto text-xs font-medium text-foreground hover:bg-muted border border-transparent hover:border-border transition-colors"
            data-testid="copy-link-button"
            onClick={handleCopy}
          >
            <Copy className="h-3.5 w-3.5" />
            {t("copy")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title={t("delete")}
            data-testid="delete-event-button"
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
