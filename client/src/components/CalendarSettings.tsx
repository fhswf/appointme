import { useState, useEffect } from "react";
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
import { Bell, Edit, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { addAccount, removeAccount, listAccounts, listCalendars } from "../helpers/services/caldav_services";
import { Input } from "@/components/ui/input";
import ErrorBoundary from "./ErrorBoundary";
import { useAuth } from "./AuthProvider";

const getCalendarLabel = (calendar: any) => calendar.summaryOverride ? calendar.summaryOverride : calendar.summary;

const getCalendarProvenance = (calendar: any) => {
    if (!calendar.isCalDav) return "Google";
    return calendar.accountName ? `CalDAV - ${calendar.accountName}` : "CalDAV";
};

const CalendarProvenance = ({ calendar }: { calendar: any }) => (
    <span className="text-xs text-muted-foreground">
        {getCalendarProvenance(calendar)}
    </span>
);

const renderCalendarList = (calendarList: any, state: any, setState: any, t: any, single = false) => {
    const items = calendarList.items.map((item: any) => {
        const iconSrc = item.isCalDav ? "/icons/caldav.png" : "/icons/google_calendar_icon.svg";
        const label = getCalendarLabel(item);

        if (single) {
            return (
                <SelectItem key={item.id} value={item.id}>
                    <div className="flex items-center gap-2">
                        <img src={iconSrc} alt="icon" className="w-4 h-4" />
                        <span className="flex flex-col">
                            <span>{label}</span>
                            <CalendarProvenance calendar={item} />
                        </span>
                    </div>
                </SelectItem>
            );
        } else {
            return (
                <div className="flex items-start gap-2" key={item.id}>
                    <Checkbox
                        id={item.id}
                        aria-label={label}
                        checked={!!state[item.id]}
                        onCheckedChange={(checked) => {
                            setState((prev: any) => ({ ...prev, [item.id]: checked }));
                        }}
                        name={item.id}
                    />
                    <Label htmlFor={item.id} className="flex cursor-pointer items-start gap-2">
                        <img src={iconSrc} alt="icon" className="mt-0.5 w-4 h-4" />
                        <span className="flex flex-col">
                            <span>{label}</span>
                            <CalendarProvenance calendar={item} />
                        </span>
                    </Label>
                </div>
            );
        }
    });

    if (single) {
        const selected = Object.keys(state)[0];
        return (
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="calendar-select">{t("Calendar")}</Label>
                <Select
                    value={selected}
                    onValueChange={(value) => {
                        setState({ [value]: true });
                    }}
                >
                    <SelectTrigger id="calendar-select" data-testid="calendar-select">
                        <SelectValue placeholder={t("Select a calendar")} />
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

const REMINDER_MINUTE_OPTIONS = [0, 5, 10, 15, 30, 60, 120, 1440, 2880, 10080];

const reminderMinutesLabel = (minutes: number, t: any) => {
    if (minutes === 0) return t("At event start");
    if (minutes < 60) return `${minutes} ${t("minutes before")}`;
    if (minutes % 1440 === 0) {
        const days = minutes / 1440;
        return days === 1 ? t("1 day before") : `${days} ${t("days before")}`;
    }
    if (minutes % 60 === 0) {
        const hours = minutes / 60;
        return hours === 1 ? t("1 hour before") : `${hours} ${t("hours before")}`;
    }
    return `${minutes} ${t("minutes before")}`;
};

export const ReminderSettings = ({ user }: { user: any }) => {
    const { t } = useTranslation();
    const { setUser } = useAuth();
    const [method, setMethod] = useState(user?.calendar_reminder_method || 'popup');
    const [minutes, setMinutes] = useState(String(user?.calendar_reminder_minutes ?? 15));

    useEffect(() => {
        setMethod(user?.calendar_reminder_method || 'popup');
        setMinutes(String(user?.calendar_reminder_minutes ?? 15));
    }, [user]);

    const save = () => {
        const updatedUser = {
            ...user,
            calendar_reminder_method: method,
            calendar_reminder_minutes: Number(minutes)
        };

        updateUser(updatedUser)
            .then((res) => {
                toast.success(t("Reminder settings saved"));
                setUser(res.data);
            })
            .catch((err) => {
                console.error("user update failed: %o", err);
                toast.error(t("Failed to save settings"));
            });
    };

    return (
        <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800">
                    <Bell className="h-5 w-5 text-gray-500" />
                    {t("Reminder setting")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
                    <div className="grid gap-2 md:col-span-5">
                        <Label htmlFor="calendar-reminder-method" className="text-sm font-medium text-gray-700">{t("Notification type")}</Label>
                        <select
                            id="calendar-reminder-method"
                            data-testid="calendar-reminder-method"
                            value={method}
                            onChange={(event) => setMethod(event.target.value)}
                            className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="popup">{t("System notification")}</option>
                            <option value="email">{t("Email")}</option>
                            <option value="none">{t("No reminder")}</option>
                        </select>
                    </div>
                    <div className="grid gap-2 md:col-span-5">
                        <Label htmlFor="calendar-reminder-minutes" className="text-sm font-medium text-gray-700">{t("Reminder time")}</Label>
                        <select
                            id="calendar-reminder-minutes"
                            data-testid="calendar-reminder-minutes"
                            value={minutes}
                            onChange={(event) => setMinutes(event.target.value)}
                            disabled={method === 'none'}
                            className="h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {REMINDER_MINUTE_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {reminderMinutesLabel(option, t)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button onClick={save} data-testid="save-reminder-settings" className="w-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 md:col-span-2">
                        {t("Save")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export const PushCalendar = ({ user, calendarList }: { user: any, calendarList: any }) => {
    const currentPushCalendars = user.push_calendars || [];

    const pushCals = calendarList
        ? calendarList.items
            .filter((item: any) => currentPushCalendars.includes(item.id))
            .map((cal: any) => (
                <li key={cal.id} className="flex items-center gap-3">
                    <img src={cal.isCalDav ? "/icons/caldav.png" : "/icons/google_calendar_icon.svg"} alt="icon" className="h-4 w-4 opacity-70" />
                    <span className="flex flex-col">
                        <span>{getCalendarLabel(cal)}</span>
                        <CalendarProvenance calendar={cal} />
                    </span>
                </li>
            ))
        : undefined;

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>({});
    const { t } = useTranslation();

    useEffect(() => {
        if (open) {
            const initialSelected: any = {};
            for (const id of currentPushCalendars) {
                initialSelected[id] = true;
            }
            setSelected(initialSelected);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);


    const handleClose = () => setOpen(false);
    const handleShow = () => setOpen(true);

    const { setUser } = useAuth();
    const save = () => {
        const newSelection = [];
        for (const item of Object.keys(selected)) {
            if (selected[item]) {
                newSelection.push(item);
            }
        }

        const updatedUser = { ...user, push_calendars: newSelection };

        updateUser(updatedUser)
            .then((res) => {
                toast.success(t("Calendar settings saved"));
                setUser(res.data);
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
        <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-700">
                    {t("trite_warm_gorilla_pet")}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={handleShow} data-testid="edit-push-calendar" className="h-9 w-9 text-gray-400 hover:text-blue-600">
                    <Edit className="h-5 w-5" />
                </Button>
            </CardHeader>
            <CardContent>
                {pushCals && pushCals.length > 0 ? (
                    <ul className="space-y-3 text-sm text-gray-600">{pushCals}</ul>
                ) : (
                    <div className="text-sm text-muted-foreground">{t("No calendar selected")}</div>
                )}
            </CardContent>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("Calendar")}</DialogTitle>
                        <DialogDescription>
                            {t("Choose calendars in which appointments are created.")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {renderCalendarList(
                            calendarList,
                            selected,
                            setSelected,
                            t,
                            false
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

export const PullCalendars = ({ user, calendarList }: { user: any, calendarList: any }) => {
    const pullCals = calendarList
        ? calendarList.items
            .filter((item: any) => user.pull_calendars.includes(item.id))
            .map((cal: any) => (
                <li key={cal.id} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="flex flex-col">
                        <span>{getCalendarLabel(cal)}</span>
                        <CalendarProvenance calendar={cal} />
                    </span>
                </li>
            ))
        : undefined;

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>({});
    const { t } = useTranslation();

    useEffect(() => {
        if (open) {
            const initialSelected: any = {};
            for (const id of user.pull_calendars) {
                initialSelected[id] = true;
            }
            setSelected(initialSelected);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleClose = () => setOpen(false);
    const handleShow = () => setOpen(true);
    const { setUser } = useAuth();
    const save = () => {

        const updatedUser = { ...user, pull_calendars: [] };
        for (const item of Object.keys(selected)) {
            if (selected[item]) {
                updatedUser.pull_calendars.push(item);
            }
        }
        updateUser(updatedUser)
            .then((res) => {
                toast.success(t("Calendar settings saved"));
                setUser(res.data);
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
        const _selected: any = {};
        for (const item of user.pull_calendars) {
            _selected[item] = true;
        }
        return (
            <>
                <Card className="border-gray-200 bg-white shadow-sm">
                    <CardHeader className="flex flex-row items-start justify-between pb-4">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-700">
                            {t("aware_alert_mare_glow")}
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={handleShow} data-testid="edit-pull-calendar" className="h-9 w-9 text-gray-400 hover:text-blue-600">
                            <Edit className="h-5 w-5" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {pullCals && pullCals.length > 0 ? (
                            <ul className="space-y-2 text-sm text-gray-600">{pullCals}</ul>
                        ) : (
                            <div className="text-sm text-muted-foreground">{t("No calendar selected")}</div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t("Calendar")}</DialogTitle>
                            <DialogDescription>
                                {t("big_known_loris_revive")}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            {renderCalendarList(
                                calendarList,
                                selected || _selected,
                                setSelected,
                                t
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

export const CalDavAccounts = ({ user, onAccountsChange }: { user: any, onAccountsChange: any }) => {
    const [accounts, setAccounts] = useState<any[]>([]);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleRemove = (id: string) => {
        removeAccount(id).then(() => loadAccounts());
    };

    return (
        <>
            <div className="space-y-3">
                <Card className="border-gray-200 bg-white shadow-sm">
                    <CardContent className="flex items-center justify-between gap-4 p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                                <img
                                    alt="CalDav Calendar"
                                    src="/icons/caldav.png"
                                    className="h-6 w-6 object-contain"
                                />
                            </div>
                            <span className="font-medium text-gray-700">{t("CalDav Calendar")}</span>
                        </div>
                        <Button onClick={() => setOpen(true)} data-testid="add-caldav-button" className="bg-blue-600 text-white shadow-sm hover:bg-blue-700">
                            {t("Add CalDav Account")}
                        </Button>
                    </CardContent>
                </Card>
                {accounts.length > 0 && (
                    <div className="ml-0 flex flex-col gap-3 sm:ml-4">
                        {accounts.map(acc => (
                            <div key={acc._id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-600">{acc.name}</span>
                                    {acc.email && <span className="text-xs text-muted-foreground">{acc.email}</span>}
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleRemove(acc._id)} className="h-9 w-9 text-gray-400 hover:text-red-500">
                                    <Trash2 className="h-5 w-5" />
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

export const CalendarSettings = () => {
    const [connected, setConnected] = useState(false);
    const [url, setUrl] = useState("");
    const [calendarList, setCalendarList] = useState<any>(null);
    const { t } = useTranslation();
    const { user, refreshAuth, setUser } = useAuth();

    const revokeScopes = async (event: any) => {
        event.preventDefault();
        try {
            await deleteAccess(null);
            setConnected(false);
            setGoogleCalendars([]);
            toast.success(t("Google Calendar disconnected"));
            refreshAuth();
        } catch (err) {
            console.error("Failed to revoke Google access:", err);
            toast.error(t("Failed to disconnect Google Calendar"));
        }
    }

    useEffect(() => {
        getCalendarList()
            .then((res) => {
                setConnected(true);
                const calendars = res.data.data;
                const googleItems = calendars.items.map((c: any) => ({ ...c, isCalDav: false }));
                setGoogleCalendars(googleItems);

                const primary = googleItems.filter((item: any) => item.primary);

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
                            setUser(user.data);
                        })
                        .catch((err) => {
                            console.error("user update failed: %o", err);
                        });
                }
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    setConnected(false);
                    getAuthUrl()
                        .then((res) => {
                            setUrl(res.data.url as string);
                        })
                        .catch((err) => {
                            console.error("Failed to get Google auth URL:", err);
                        });
                } else {
                    console.error("Unexpected error loading Google calendars:", err);
                    setConnected(false);
                }
            });
    }, [user]);

    const [calendarError, setCalendarError] = useState<string | null>(null);

    const [googleCalendars, setGoogleCalendars] = useState<any[]>([]);
    const [calDavCalendars, setCalDavCalendars] = useState<any[]>([]);

    // Merge calendar lists whenever they change
    useEffect(() => {
        const allCalendars = [...googleCalendars, ...calDavCalendars];
        setCalendarList({ items: allCalendars });
    }, [googleCalendars, calDavCalendars]);

    const handleAccountsChange = async (accounts: any[]) => {
        setCalendarError(null);
        const newCalDavCalendars = [];
        const errors = [];

        for (const acc of accounts) {
            try {
                const res = await listCalendars(acc._id);
                const cals = res.data.map((c: any) => ({ ...c, isCalDav: true, accountId: acc._id, accountName: acc.name }));
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
                <Button onClick={revokeScopes} variant="destructive" data-testid="disconnect-google-button" className="bg-red-500 text-white shadow-sm hover:bg-red-600">
                    {t("lower_born_finch_dash")}
                </Button>
            );
        } else {
            return (
                <Button asChild data-testid="connect-google-button" className="bg-blue-600 text-white shadow-sm hover:bg-blue-700">
                    <a href={url}>{t("whole_formal_liger_rise")}</a>
                </Button>
            );
        }
    };

    return (
        <div className="space-y-12">
            {calendarError && (
                <div className="mb-4 bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                    {calendarError}
                </div>
            )}

            <section className="space-y-4">
                <Card className="border-gray-200 bg-white shadow-sm">
                    <CardContent className="flex items-center justify-between gap-4 p-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                                <img
                                    alt="Google Calendar"
                                    src="/icons/google_calendar_icon.svg"
                                    className="h-6 w-6 object-contain"
                                />
                            </div>
                            <span className="font-medium text-gray-700">{t("upper_even_florian_peek")}</span>
                        </div>
                        <div>{renderConnectButton()}</div>
                    </CardContent>
                </Card>

                <ErrorBoundary>
                    <CalDavAccounts user={user} onAccountsChange={handleAccountsChange} />
                </ErrorBoundary>
            </section>

            <section>
                <ErrorBoundary>
                    <ReminderSettings user={user} />
                </ErrorBoundary>
            </section>

            {(calendarList && calendarList.items.length > 0) && (
                <section className="space-y-6">
                    <h4 className="text-xl font-bold text-gray-900">
                        {t("merry_north_meerkat_cuddle")}
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
                        <ErrorBoundary>
                            <PushCalendar user={user} calendarList={calendarList} />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <PullCalendars user={user} calendarList={calendarList} />
                        </ErrorBoundary>
                    </div>
                </section>
            )}
        </div>
    );
};
