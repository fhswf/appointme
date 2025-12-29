import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS, de, es, fr, it, ja, ko, zhCN } from "date-fns/locale";
import { Calendar as BigCalendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar as SmallCalendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment } from "common";
import { Clock, MapPin, User, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const locales = {
    "en-US": enUS,
    "en": enUS,
    "de": de,
    "es": es,
    "fr": fr,
    "it": it,
    "ja": ja,
    "ko": ko,
    "zh": zhCN
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface PopulatedAppointment extends Omit<Appointment, 'event'> {
    event: {
        name: string;
        description?: string;
    };
}

interface AppointmentEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: PopulatedAppointment;
}

const AppointmentDetails = ({ appointment, onClose }: { appointment: PopulatedAppointment, onClose: () => void }) => {
    const { t, i18n } = useTranslation();

    if (!appointment) return null;

    return (
        <Card className="h-full border-l border-border rounded-l-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">{t("appointment_details")}</CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <span className="sr-only">{t("close")}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg">{appointment.description || t("appointment")}</h3>
                    <div className="flex items-center text-muted-foreground mt-1">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>
                            {format(new Date(appointment.start), "PP p", { locale: locales[i18n.language] || enUS })} - {format(new Date(appointment.end), "p", { locale: locales[i18n.language] || enUS })}
                        </span>
                    </div>
                </div>

                {appointment.location && (
                    <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{appointment.location}</span>
                    </div>
                )}

                <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-semibold mb-2">{t("attendee")}</h4>
                    <div className="flex items-center mb-1">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{appointment.attendeeName}</span>
                    </div>
                    <div className="ml-6 text-sm text-muted-foreground">
                        {appointment.attendeeEmail}
                    </div>
                </div>

                <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-semibold mb-2">{t("event_type")}</h4>
                    <div className="flex items-center mb-1">
                        <span>{appointment.event.name}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const CustomToolbar = (toolbar: any) => {
    const { t, i18n } = useTranslation();
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };
    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };
    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    const label = () => {
        const date = toolbar.date;
        return (
            <span className="text-lg font-semibold capitalize">
                {format(date, "MMMM yyyy", { locale: locales[i18n.language] || enUS })}
            </span>
        );
    };

    return (
        <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToBack} className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToCurrent} className="h-8">
                    {t("today")}
                </Button>
                <Button variant="outline" size="icon" onClick={goToNext} className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <span className="ml-4">{label()}</span>
            </div>

            <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
                <Button
                    variant={toolbar.view === Views.MONTH ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => toolbar.onView(Views.MONTH)}
                    className="h-7 text-xs"
                >
                    {t("month")}
                </Button>
                <Button
                    variant={toolbar.view === Views.WEEK ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => toolbar.onView(Views.WEEK)}
                    className="h-7 text-xs"
                >
                    {t("week")}
                </Button>
                <Button
                    variant={toolbar.view === Views.DAY ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => toolbar.onView(Views.DAY)}
                    className="h-7 text-xs"
                >
                    {t("day")}
                </Button>
            </div>
        </div>
    );
};

const AgendaView = () => {
    const { t } = useTranslation();
    const [events, setEvents] = useState<AppointmentEvent[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [view, setView] = useState<View>(Views.WEEK);
    const [selectedAppointment, setSelectedAppointment] = useState<PopulatedAppointment | null>(null);


    const scrollToTime = useMemo(() => new Date(), []);

    useEffect(() => {
        axios.get("/api/v1/user/me/appointment")
            .then(res => {
                if (Array.isArray(res.data)) {
                    const mappedEvents = res.data.map((apt: any) => ({
                        id: apt._id,
                        title: apt.description || apt.event?.name || t("appointment"),
                        start: new Date(apt.start),
                        end: new Date(apt.end),
                        resource: apt
                    }));
                    setEvents(mappedEvents);
                }
            })
            .catch(err => {
                console.error("Failed to fetch appointments", err);
            })
            .finally(() => {

            });
    }, [t]);

    const onSelectEvent = (event: AppointmentEvent) => {
        setSelectedAppointment(event.resource);
    };

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
        }
    };

    // Add custom styles for calendar events
    const eventStyleGetter = (event: AppointmentEvent, start: Date, end: Date, isSelected: boolean) => {
        const style = {
            backgroundColor: 'var(--primary)',
            borderRadius: '4px',
            opacity: 0.8,
            color: 'var(--primary-foreground)',
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
    };

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] lg:flex-row gap-6">
            <div className="w-full lg:w-auto flex flex-col gap-6">
                <div className="border rounded-md p-4 bg-card shadow-sm">
                    <SmallCalendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        className="rounded-md border-none shadow-none"
                    />
                </div>

                {/* List of events for the selected day could go here */}
                <div className="flex-1 lg:hidden">
                    {/* Responsive spacer or additional info */}
                </div>
            </div>

            <div className={`flex-1 flex flex-col overflow-hidden bg-card rounded-md border shadow-sm transition-all duration-300 ${selectedAppointment ? 'mr-0' : ''}`}>
                <div className="flex-1 p-4 h-full">
                    <BigCalendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        view={view}
                        onView={setView}
                        date={selectedDate}
                        onNavigate={handleDateChange}
                        style={{ height: '100%' }}
                        onSelectEvent={onSelectEvent}
                        components={{
                            toolbar: CustomToolbar
                        }}
                        eventPropGetter={eventStyleGetter}
                        messages={{
                            week: t("week"),
                            work_week: t("work_week"),
                            day: t("day"),
                            month: t("month"),
                            previous: t("back"),
                            next: t("next"),
                            today: t("today"),
                            agenda: t("agenda"),
                            showMore: (total) => `+${total} ${t("more")}`,
                        }}
                        scrollToTime={scrollToTime}
                    />
                </div>
            </div>

            {selectedAppointment && (
                <div className="w-full lg:w-80 h-full animate-in slide-in-from-right-10 duration-300 shadow-xl z-10 border-l">
                    <AppointmentDetails
                        appointment={selectedAppointment}
                        onClose={() => setSelectedAppointment(null)}
                    />
                </div>
            )}
        </div>
    );
};

export default AgendaView;
