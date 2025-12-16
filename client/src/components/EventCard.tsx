import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { deleteEvent } from "../helpers/services/event_services";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Share, Trash } from "lucide-react";
import { EventDocument } from "../helpers/EventDocument";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import "./EventCard.css";

type EventCardProps = {
  event: EventDocument;
  url: string;
  setActive: (event: EventDocument, active: boolean) => void;
  onDelete: (event: EventDocument) => void;
};

export const EventCard = (props: EventCardProps) => {
  const [active, setActive] = useState(props.event.isActive);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const event = props.event;

  const toggleActive = (checked: boolean) => {
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
    <Card className={`max-w-[25rem] ${active ? "active" : "inactive"}`} data-testid="event-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl">{props.event.name}</CardTitle>
            <CardDescription>{props.event.duration} min</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            asChild
            data-testid="edit-event-button"
          >
            <RouterLink to={`/editevent/${props.event._id}`}>
              <Edit className="h-4 w-4" />
            </RouterLink>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{props.event.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Switch
          data-testid="active-switch"
          checked={active}
          onCheckedChange={toggleActive}
          aria-label="active"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            data-testid="copy-link-button"
            aria-label={t("event_copy_link")}
            onClick={handleCopy}
          >
            <Share className="mr-2 h-4 w-4" />
            {t("event_copy_link")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            data-testid="delete-event-button"
            aria-label="delete"
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
