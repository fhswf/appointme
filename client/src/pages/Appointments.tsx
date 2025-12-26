import React, { useEffect, useState } from "react";
import axios from "axios";
import { Appointment, Event, IntervalSet } from "common";
import { Views, View } from 'react-big-calendar'

import AppNavbar from "../components/AppNavbar";
import Footer from "../components/Footer";
import { AppointmentSidebar } from "../components/appointments/AppointmentSidebar";
import { AppointmentCalendar } from "../components/appointments/AppointmentCalendar";
import { AppointmentDetails } from "../components/appointments/AppointmentDetails";
import { EventDetails } from "../components/appointments/EventDetails";
import { ResizableSidebar } from "@/components/ui/resizable-sidebar";
import { getUsersEvents } from "../helpers/services/event_services";
import { useAuth } from "../components/AuthProvider";
import { updateUser } from "../helpers/services/user_services";
import { startOfDay } from "date-fns";

import { Calendar, fetchCalendarEvents, calculateAvailabilityEvents, getTimeRangeForView } from "../helpers/calendar_helpers";

const CALENDAR_COLORS = [
    "#3b82f6", // Blue
    "#9333ea", // Purple
    "#16a34a", // Green
    "#ea580c"  // Orange
];

const Appointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [events, setEvents] = useState<Record<string, Event>>({});
    const [loading, setLoading] = useState(true);
    const [calendars, setCalendars] = useState<Calendar[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
    const [backgroundEvents, setBackgroundEvents] = useState<any[]>([]);

    // View State
    const [date, setDate] = useState<Date>(new Date());
    const [view, setView] = useState<View>(Views.MONTH);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<any | null>(null);
    const [sidebarWidth, setSidebarWidth] = useState(320);

    const { user } = useAuth(); // Add useAuth hook

    // Fetch calendars from unified endpoint
    useEffect(() => {
        const fetchCalendars = async () => {
            try {
                const response = await axios.get("/api/v1/user/me/calendar");
                console.log("Calendars response:", response.data);

                if (response.data && Array.isArray(response.data)) {
                    const calendarList: Calendar[] = response.data.map((cal: any, index: number) => ({
                        id: cal.type === 'google' ? `google-${cal.id}` : `caldav-${cal.id}`,
                        label: cal.summary || cal.id,
                        color: cal.color || CALENDAR_COLORS[index % CALENDAR_COLORS.length],
                        checked: user?.agenda_visible_calendars && user.agenda_visible_calendars.length > 0
                            ? user.agenda_visible_calendars.includes(cal.type === 'google' ? `google-${cal.id}` : `caldav-${cal.id}`)
                            : cal.primary || index === 0,
                        type: cal.type,
                        accountId: cal.accountId,
                        originalId: cal.id,
                    }));

                    setCalendars(calendarList);
                }
            } catch (err) {
                console.log("Failed to fetch calendars", err);
                // Set empty array on error
                setCalendars([]);
            }
        };

        fetchCalendars();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [aptRes, evtRes] = await Promise.all([
                    axios.get("/api/v1/user/me/appointment"),
                    getUsersEvents()
                ]);

                setAppointments(aptRes.data);

                const eventMap: Record<string, Event> = {};
                if (Array.isArray(evtRes.data)) {
                    for (const evt of evtRes.data) {
                        if (evt._id) eventMap[evt._id] = evt;
                    }
                }
                setEvents(eventMap);

            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fetch calendar events when calendars or view changes
    useEffect(() => {
        const fetchCalendarEventsAndAvailability = async () => {
            // 1. Calculate time range based on current view
            const { timeMin, timeMax } = getTimeRangeForView(view, date);

            // 2. Fetch external calendar events
            const allEvents = await fetchCalendarEvents(calendars, timeMin, timeMax);
            setCalendarEvents(allEvents);

            // 3. Calculate Availability Background Events
            const bgEvents = calculateAvailabilityEvents(events, view, timeMin, timeMax);
            setBackgroundEvents(bgEvents);
        };

        if (calendars.length >= 0) { // Always run to calc availability even if no calendars
            fetchCalendarEventsAndAvailability();
        }
    }, [calendars, date, view, events]);



    const handleDateChange = (newDate: Date | undefined) => {
        if (newDate) setDate(newDate);
    };

    const handleCalendarToggle = (id: string) => {
        setCalendars(prev => {
            const newCalendars = prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c);
            const visibleIds = newCalendars.filter(c => c.checked).map(c => c.id);

            if (user) {
                updateUser({ ...user, agenda_visible_calendars: visibleIds })
                    .catch(err => console.error("Failed to save calendar visibility", err));
            }
            return newCalendars;
        });
    };

    // Enrich appointments with event details
    const enrichedAppointments = appointments.map(apt => ({
        ...apt,
        eventDetails: events[apt.event]
    }));

    // Merge appointments and calendar events for display
    const allEvents = [
        ...enrichedAppointments.map(apt => ({
            id: apt._id,
            title: apt.eventDetails?.name || 'Appointment',
            start: new Date(apt.start),
            end: new Date(apt.end),
            resource: { type: 'appointment', data: apt }
        })),
        ...calendarEvents.map(evt => ({
            id: evt.id,
            title: evt.summary || 'Event',
            start: new Date(evt.start?.dateTime || evt.start),
            end: new Date(evt.end?.dateTime || evt.end),
            resource: { type: 'calendar', data: evt, color: evt.calendarColor }
        }))
    ];

    // Get dates that have appointments or events for highlighting
    const datesWithAppointments = new Set([
        ...appointments.map(apt => startOfDay(new Date(apt.start)).getTime()),
        ...calendarEvents.map(evt => startOfDay(new Date(evt.start?.dateTime || evt.start)).getTime())
    ]);

    return (
        <div className="h-screen flex flex-col bg-background text-foreground">
            <AppNavbar />

            <main className="flex-1 flex overflow-hidden">
                <AppointmentSidebar
                    date={date}
                    setDate={handleDateChange}
                    calendars={calendars}
                    onCalendarToggle={handleCalendarToggle}
                    datesWithAppointments={datesWithAppointments}
                />

                <section className="flex-1 flex flex-col bg-background overflow-hidden relative border-l border-border">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <AppointmentCalendar
                            events={allEvents}
                            backgroundEvents={backgroundEvents}
                            date={date}
                            onDateChange={setDate}
                            view={view}
                            onViewChange={setView}
                            onSelectEvent={(evt) => {
                                // Clear both selections first
                                setSelectedAppointment(null);
                                setSelectedCalendarEvent(null);

                                // Set the appropriate selection based on type
                                if (evt.resource?.type === 'appointment') {
                                    setSelectedAppointment(evt.resource.data);
                                } else if (evt.resource?.type === 'calendar') {
                                    setSelectedCalendarEvent(evt.resource.data);
                                }
                            }}
                        />
                    )}

                    {/*                     <Button
                        size="icon"
                        className="absolute bottom-8 right-8 h-14 w-14 rounded-full shadow-lg shadow-primary/40 z-10"
                        onClick={() => {}}
                    >
                        <Plus className="h-6 w-6" />
                    </Button> */}
                </section>

                {selectedAppointment && (
                    <ResizableSidebar
                        initialWidth={360}
                        minWidth={300}
                        maxWidth={600}
                        side="right"
                        width={sidebarWidth}
                        onResize={setSidebarWidth}
                    >
                        <AppointmentDetails
                            appointment={selectedAppointment}
                            event={events[selectedAppointment.event]}
                            onClose={() => setSelectedAppointment(null)}
                        />
                    </ResizableSidebar>
                )}

                {selectedCalendarEvent && (
                    <ResizableSidebar
                        initialWidth={360}
                        minWidth={300}
                        maxWidth={600}
                        side="right"
                        width={sidebarWidth}
                        onResize={setSidebarWidth}
                    >
                        <EventDetails
                            event={selectedCalendarEvent}
                            onClose={() => setSelectedCalendarEvent(null)}
                        />
                    </ResizableSidebar>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Appointments;
