import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
import { toast } from "sonner";

import { updateUser } from "../helpers/services/user_services";
import {
  getAuthUrl,
  getCalendarList,
  deleteAccess,
} from "../helpers/services/google_services";

import { Edit, Trash2 } from "lucide-react";

import { UserContext } from "../components/PrivateRoute";
import { useTranslation } from "react-i18next";
import { addAccount, removeAccount, listAccounts, listCalendars } from "../helpers/services/caldav_services";
import { Input } from "@/components/ui/input";

import ErrorBoundary from "../components/ErrorBoundary";

const renderCalendarList = (calendarList, state, setState, single = false) => {
  // Merge google and caldav items for display if they are separate in the future, 
  // but for now we will pass a unified list or handle them inside the list.
  // Actually, the plan is to display them with icons.

  const items = calendarList.items.map((item) => {
    const iconSrc = item.isCalDav ? "/icons/caldav.png" : "/icons/google_calendar_icon.svg";
    const label = item.summaryOverride ? item.summaryOverride : item.summary;

    if (single) {
      return (
        <SelectItem key={item.id} value={item.id}>
          <div className="flex items-center gap-2">
            <img src={iconSrc} alt="icon" className="w-4 h-4" />
            <span>{label}</span>
          </div>
        </SelectItem>
      );
    } else {
      return (
        <div className="flex items-center gap-2" key={item.id}>
          <Checkbox
            id={item.id}
            checked={state[item.id]}
            onCheckedChange={(checked) => {
              setState({ ...state, [item.id]: checked });
            }}
            name={item.id}
          />
          <Label htmlFor={item.id} className="flex items-center gap-2 cursor-pointer">
            <img src={iconSrc} alt="icon" className="w-4 h-4" />
            <span>{label}</span>
          </Label>
        </div>
      );
    }
  });

  if (single) {
    const selected = Object.keys(state)[0];
    return (
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="calendar-select">Calendar</Label>
        <Select
          value={selected}
          onValueChange={(value) => {
            setState({ [value]: true });
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
    return <div className="flex flex-col gap-2">{items}</div>;
  }
};

const PushCalendar = ({ user, calendarList }) => {
  // Get current push calendars
  const currentPushCalendars = user.push_calendars || [];

  const pushCals = calendarList
    ? calendarList.items
      .filter((item) => currentPushCalendars.includes(item.id))
      .map((cal) => (
        <li key={cal.id} className="flex items-center gap-2">
          <img src={cal.isCalDav ? "/icons/caldav.png" : "/icons/google_calendar_icon.svg"} alt="icon" className="w-4 h-4" />
          {cal.summaryOverride ? cal.summaryOverride : cal.summary}
        </li>
      ))
    : undefined;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({});
  const { t } = useTranslation();

  // Initialize selected state from user's current push calendars
  useEffect(() => {
    if (open) {
      const initialSelected = {};
      for (const id of currentPushCalendars) {
        initialSelected[id] = true;
      }
      setSelected(initialSelected);
    }
  }, [open, user]);


  const handleClose = () => setOpen(false);
  const handleShow = () => setOpen(true);

  const save = () => {
    console.log("save: selected: %o", selected);
    user.push_calendars = [];

    const newSelection = [];
    for (const item of Object.keys(selected)) {
      if (selected[item]) {
        newSelection.push(item);
      }
    }

    user.push_calendars = newSelection;
    // For backward compatibility, valid single push_calendar logic could be: 
    // user.push_calendar = newSelection.length > 0 ? newSelection[0] : null;
    // But we deprecated it, so cleaner to rely on the array.

    updateUser(user)
      .then((user) => {
        console.log("updated user: %o", user);
        toast.success(t("Calendar settings saved"));
      })
      .catch((err) => {
        console.error("user update failed: %o", err);
        toast.error(t("Failed to save settings"));
      });
    setOpen(false);
  };

  if (!user || !calendarList) {
    return <div></div>;
  }

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
        {pushCals && pushCals.length > 0 ? (
          <ul className="list-disc pl-4 space-y-1">{pushCals}</ul>
        ) : (
          <div className="text-sm text-muted-foreground">No calendar selected</div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Calendar</DialogTitle>
            <DialogDescription>
              Choose calendars in which appointments are created.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {renderCalendarList(
              calendarList,
              selected,
              setSelected,
              false // Allow multiple selection now!
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
    for (const item of Object.keys(selected)) {
      if (selected[item]) {
        user.pull_calendars.push(item);
      }
    }
    updateUser(user)
      .then((user) => {
        console.log("updated user: %o", user);
        toast.success(t("Calendar settings saved"));
      })
      .catch((err) => {
        console.error("user update failed: %o", err);
        toast.error(t("Failed to save settings"));
      });
    setOpen(false);
  };

  if (!user || !calendarList) {
    return <div></div>;
  } else {
    const _selected = {};
    for (const item of user.pull_calendars) {
      _selected[item] = true;
    }
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

const CalDavAccounts = ({ user, onAccountsChange }) => {
  const [accounts, setAccounts] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    serverUrl: "",
    username: "",
    password: "",
    name: "",
    email: "",
    privacyAck: false
  });
  const { t } = useTranslation();

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    listAccounts().then(res => {
      setAccounts(res.data);
      onAccountsChange(res.data);
    });
  };

  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    setError(null);
    addAccount(formData.serverUrl, formData.username, formData.password, formData.name, formData.email)
      .then(() => {
        setOpen(false);
        setFormData({ serverUrl: "", username: "", password: "", name: "", email: "", privacyAck: false });
        loadAccounts();
      })
      .catch(err => {
        console.error(err);
        setError(t("Failed to add account. Please check your credentials and server URL."));
      });
  };

  const handleRemove = (id) => {
    removeAccount(id).then(() => loadAccounts());
  };

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img
              className="icon"
              alt="CalDav Calendar"
              src="/icons/caldav.png"
              width="32"
            />
            <span>{t("CalDav Calendar")}</span>
          </div>
          <div>
            <Button onClick={() => setOpen(true)} data-testid="add-caldav-button">
              {t("Add CalDav Account")}
            </Button>
          </div>
        </div>
        {accounts.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {accounts.map(acc => (
              <div key={acc._id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex flex-col">
                  <span className="font-medium">{acc.name}</span>
                  {acc.email && <span className="text-xs text-muted-foreground">{acc.email}</span>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemove(acc._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Add CalDav Account")}</DialogTitle>
            <DialogDescription>
              {t("Enter your CalDav server details to connect your calendar.")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <form id="caldav-form" onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
              <div className="grid gap-2">
                <Label htmlFor="name">{t("Name")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Calendar"
                  data-testid="caldav-name"
                />
              </div>
              <div className="grid gap-2 mt-2">
                <Label htmlFor="email">{t("Email (Optional)")}</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  data-testid="caldav-email"
                />
              </div>
              <div className="grid gap-2 mt-2">
                <Label htmlFor="serverUrl">{t("Server URL")}</Label>
                <Input
                  id="serverUrl"
                  value={formData.serverUrl}
                  onChange={e => setFormData({ ...formData, serverUrl: e.target.value })}
                  placeholder="https://caldav.example.com"
                  data-testid="caldav-server-url"
                />
              </div>
              <div className="grid gap-2 mt-2">
                <Label htmlFor="username">{t("Username")}</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  autoComplete="username"
                  data-testid="caldav-username"
                />
              </div>
              <div className="grid gap-2 mt-2">
                <Label htmlFor="password">{t("label_password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  autoComplete="current-password"
                  data-testid="caldav-password"
                />
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id="privacy-ack"
                  checked={formData.privacyAck}
                  onCheckedChange={(checked) => setFormData({ ...formData, privacyAck: checked as boolean })}
                  data-testid="caldav-privacy-ack"
                />
                <label
                  htmlFor="privacy-ack"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("I acknowledge that my password will be stored encrypted in the database.")}
                </label>
              </div>
            </form>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>{t("Cancel")}</Button>
            <Button type="submit" form="caldav-form" disabled={!formData.privacyAck}>{t("Add")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Calendarintegration = () => {
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);
  const [url, setUrl] = useState("");
  const [calendarList, setCalendarList] = useState(null);
  const user = useContext(UserContext).user;
  const { t } = useTranslation();

  const revokeScopes = async (event) => {
    event.preventDefault();
    try {
      await deleteAccess(null);
      // Update local state to reflect disconnection
      setConnected(false);
      setGoogleCalendars([]);
      toast.success(t("Google Calendar disconnected"));
    } catch (err) {
      console.error("Failed to revoke Google access:", err);
      toast.error(t("Failed to disconnect Google Calendar"));
    }
  }


  console.log("user: %o", user);

  useEffect(() => {
    getCalendarList()
      .then((res) => {
        setConnected(true);
        const calendars = res.data.data;
        const googleItems = calendars.items.map(c => ({ ...c, isCalDav: false }));
        setGoogleCalendars(googleItems);

        // Initial setup for default calendars (moved logic slightly to use the fresh list)
        // ... (preserving logic but relying on the effect to update the main list)

        const primary = googleItems.filter((item) => item.primary);
        // ... update push/pull if needed ...
        console.log("google calendars loaded: %o", googleItems);

        let update = false;
        if (user.pull_calendars.length === 0 && primary.length > 0) {
          user.pull_calendars.push(primary[0].id);
          update = true;
        }
        if ((!user.push_calendars || user.push_calendars.length === 0) && primary.length > 0) {
          user.push_calendars = [primary[0].id];
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
        // Check if this is a 401 (missing Google auth) vs other errors
        if (err.response?.status === 401) {
          console.log("Google Calendar not connected - this is OK");
          setConnected(false);
        } else {
          console.error("Unexpected error loading Google calendars:", err);
          setConnected(false);
        }
      });

    getAuthUrl()
      .then((res) => {
        console.log("getAuthUrl: %o", res.data.url);
        setUrl(res.data.url as string);
      })
      .catch((err) => {
        console.error("Failed to get Google auth URL:", err);
        // Don't logout the user, just log the error
      });
  }, [user]);

  const [calendarError, setCalendarError] = useState<string | null>(null);

  const [googleCalendars, setGoogleCalendars] = useState([]);
  const [calDavCalendars, setCalDavCalendars] = useState([]);

  // Merge calendar lists whenever they change
  useEffect(() => {
    const allCalendars = [...googleCalendars, ...calDavCalendars];
    setCalendarList({ items: allCalendars });
  }, [googleCalendars, calDavCalendars]);

  const handleAccountsChange = async (accounts) => {
    setCalendarError(null);
    const newCalDavCalendars = [];
    const errors = [];

    for (const acc of accounts) {
      try {
        const res = await listCalendars(acc._id);
        const cals = res.data.map(c => ({ ...c, isCalDav: true, accountId: acc._id }));
        newCalDavCalendars.push(...cals);
      } catch (e) {
        console.error("Failed to load calendars for account", acc.name, e);
        errors.push(acc.name);
      }
    }

    if (errors.length > 0) {
      setCalendarError(`${t("Failed to load calendars for")}: ${errors.join(", ")}`);
    }

    setCalDavCalendars(newCalDavCalendars);
  };

  const renderConnectButton = () => {
    if (connected) {
      return (
        <Button onClick={revokeScopes} variant="destructive" data-testid="disconnect-google-button">
          {t("lower_born_finch_dash")}
        </Button>
      );
    } else {
      return (
        <Button asChild data-testid="connect-google-button">
          <a href={url}>{t("whole_formal_liger_rise")}</a>
        </Button>
      );
    }
  };

  return (
    <>
      <AppNavbar />
      <div className="container mx-auto p-4">
        <h3 className="text-3xl font-bold mb-4">
          {t("pink_loose_cougar_grin")}
        </h3>

        {calendarError && (
          <div className="mb-4 bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {calendarError}
          </div>
        )}

        <div className="p-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                className="icon"
                alt="Google Calendar"
                src="/icons/google_calendar_icon.svg"
                width="32"
              />
              {t("upper_even_florian_peek")}
            </div>
            <div>{renderConnectButton()}</div>
          </div>
        </div>

        <ErrorBoundary>
          <CalDavAccounts user={user} onAccountsChange={handleAccountsChange} />
        </ErrorBoundary>

        {/* Only show calendar settings if there are calendars available */}
        {calendarList && calendarList.items.length > 0 && (
          <>
            <h4 className="text-2xl font-bold mb-4">
              {t("merry_north_meerkat_cuddle")}
            </h4>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ErrorBoundary>
                  <PushCalendar user={user} calendarList={calendarList} />
                </ErrorBoundary>
                <ErrorBoundary>
                  <PullCalendars user={user} calendarList={calendarList} />
                </ErrorBoundary>
              </div>
            </div>
          </>
        )}

        {/* Show helpful message if no calendars are connected */}
        {(!calendarList || calendarList.items.length === 0) && (
          <div className="p-4 text-center text-muted-foreground">
            <p>{t("Connect a calendar to get started")}</p>
          </div>
        )}

        <div className="p-4 flex justify-end">
          <Button onClick={() => navigate("/")} data-testid="close-button">
            {t("Close")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Calendarintegration;
