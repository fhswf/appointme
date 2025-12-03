import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signout } from "../helpers/helpers";
import AppNavbar from "../components/AppNavbar";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { updateUser } from "../helpers/services/user_services";
import {
  getAuthUrl,
  getCalendarList,
} from "../helpers/services/google_services";

import { Edit } from "lucide-react";

import { UserContext } from "../components/PrivateRoute";
import { useTranslation } from "react-i18next";

const renderCalendarList = (calendarList, state, setState, single = false) => {
  console.log("renderCalendarList: %o", state);

  if (single) {
    const selected = Object.keys(state)[0];
    console.log("selected: %o", selected);
    const items = calendarList.items.map((item) => {
      return (
        <SelectItem key={item.id} value={item.id}>
          {item.summaryOverride ? item.summaryOverride : item.summary}
        </SelectItem>
      );
    });

    return (
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="calendar-select">Calendar</Label>
        <Select
          value={selected}
          onValueChange={(value) => {
            state = { [value]: true };
            console.log("select: %o %o", value, state);
            setState(state);
          }}
        >
          <SelectTrigger id="calendar-select" data-testid="calendar-select">
            <SelectValue placeholder="Select a calendar" />
          </SelectTrigger>
          <SelectContent>
            {items}
          </SelectContent>
        </Select>
      </div>
    );
  } else {
    const items = calendarList.items.map((item) => (
      <div className="flex items-center gap-2" key={item.id}>
        <Checkbox
          id={item.id}
          checked={state[item.id]}
          onCheckedChange={(checked) => {
            console.log(
              "onChange: %s %o\n%o",
              item.id,
              checked,
              state
            );
            setState({ ...state, [item.id]: checked });
          }}
          name={item.id}
        />
        <Label htmlFor={item.id}>
          {item.summaryOverride ? item.summaryOverride : item.summary}
        </Label>
      </div>
    ));

    return <div className="flex flex-col gap-2">{items}</div>;
  }
};

const PushCalendar = ({ user, calendarList }) => {
  const pushCal = calendarList
    ? calendarList.items.find((item) => item.id === user.push_calendar)
    : undefined;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(pushCal);
  const { t } = useTranslation();

  const handleClose = () => setOpen(false);
  const handleShow = () => setOpen(true);
  const save = () => {
    console.log("save: selected: %o", selected);
    user.push_calendar = Object.keys(selected).find((item) => selected[item]);

    updateUser(user)
      .then((user) => {
        console.log("updated user: %o", user);
      })
      .catch((err) => {
        console.error("user update failed: %o", err);
      });
    setOpen(false);
  };

  if (!user || !calendarList) {
    return <div></div>;
  }

  console.log("pushCalendar: %o %o", pushCal, calendarList);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {t("trite_warm_gorilla_pet")}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={handleShow} data-testid="edit-push-calendar">
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {pushCal.summaryOverride ? pushCal.summaryOverride : pushCal.summary}
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Calendar</DialogTitle>
            <DialogDescription>
              Choose a calendar in which appointments are created.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {renderCalendarList(
              calendarList,
              selected || { [user.push_calendar]: true },
              setSelected,
              true
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              {t("teal_lofty_hawk_peek")}
            </Button>
            <Button onClick={save} data-testid="button-save">
              {t("mild_raw_elk_delight")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const PullCalendars = ({ user, calendarList }) => {
  const pullCals = calendarList
    ? calendarList.items
      .filter((item) => user.pull_calendars.includes(item.id))
      .map((cal) => (
        <li key={cal.id}>{cal.summaryOverride ? cal.summaryOverride : cal.summary}</li>
      ))
    : undefined;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(pullCals);
  const { t } = useTranslation();

  const handleClose = () => setOpen(false);
  const handleShow = () => setOpen(true);
  const save = () => {
    console.log("save: selected: %o", selected);
    user.pull_calendars = [];
    Object.keys(selected).forEach((item) => {
      console.log("save: item %s", item);
      if (selected[item]) {
        console.log("save: %s is true", item);
        user.pull_calendars.push(item);
      }
    });
    updateUser(user)
      .then((user) => {
        console.log("updated user: %o", user);
      })
      .catch((err) => {
        console.error("user update failed: %o", err);
      });
    setOpen(false);
  };

  if (!user || !calendarList) {
    return <div></div>;
  } else {
    const _selected = {};
    user.pull_calendars.forEach((item) => (_selected[item] = true));
    return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {t("aware_alert_mare_glow")}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleShow} data-testid="edit-pull-calendar">
              <Edit className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4">{pullCals}</ul>
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Calendar</DialogTitle>
              <DialogDescription>
                {t("big_known_loris_revive")}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {renderCalendarList(
                calendarList,
                selected || _selected,
                setSelected
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                {t("tiny_teary_clownfish_vent")}
              </Button>
              <Button onClick={save}>
                {t("factual_nimble_snail_clap")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }
};

const Calendarintegration = () => {
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);
  const [url, setUrl] = useState("");
  const [calendarList, setCalendarList] = useState(null);
  const user = useContext(UserContext).user;
  const { t } = useTranslation();

  const revokeScopes = (event) => {
    event.preventDefault();
    signout();
    navigate("/landing");
  }


  console.log("user: %o", user);

  useEffect(() => {
    getCalendarList()
      .then((res) => {
        setConnected(true);
        setCalendarList(res.data.data);
        const calendars = res.data.data;
        const primary = calendars.items.filter((item) => item.primary);
        console.log("calendarList: %o %o", calendars, primary);
        let update = false;
        if (user.pull_calendars.length === 0) {
          user.pull_calendars.push(primary[0].id);
          update = true;
        }
        if (!user.push_calendar) {
          user.push_calendar = primary[0].id;
          update = true;
        }

        if (update) {
          updateUser(user)
            .then((user) => {
              console.log("updated user: %o", user);
            })
            .catch((err) => {
              console.error("user update failed: %o", err);
            });
        }
      })
      .catch((err) => {
        console.error("getCalendarList failed: %o", err);
        setConnected(false);
      });

    getAuthUrl().then((res) => {
      if (res.data.success === false) {
        signout();
        navigate("/landing");
      } else {
        console.log("getAuthUrl: %o", res.data.url);
        setUrl(res.data.url as string);
      }
    });
  }, [user]);

  const renderConnectButton = () =>
    connected ? (
      <Button onClick={revokeScopes}>
        {t("lower_born_finch_dash")}
      </Button>
    ) : (
      <Button asChild>
        <a href={url}>{t("whole_formal_liger_rise")}</a>
      </Button>
    );

  return (
    <>
      <AppNavbar />
      <div className="container mx-auto p-4">
        <h3 className="text-3xl font-bold mb-4">
          {t("pink_loose_cougar_grin")}
        </h3>
        <div className="p-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                className="icon"
                alt="Google Calendar"
                src="/icons/google_calendar_icon.svg"
                width="32"
              />{" "}
              {t("upper_even_florian_peek")}
            </div>
            <div>{renderConnectButton()}</div>
          </div>
        </div>

        <h4 className="text-2xl font-bold mb-4">
          {t("merry_north_meerkat_cuddle")}
        </h4>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PushCalendar user={user} calendarList={calendarList} />
            <PullCalendars user={user} calendarList={calendarList} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendarintegration;
