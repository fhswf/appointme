import React, { useEffect, useState } from "react";
import axios from "axios";
import { Appointment, Event } from "common";
import { Views, View } from 'react-big-calendar'
import AppNavbar from "../components/AppNavbar";
import Footer from "../components/Footer";
import { AppointmentSidebar } from "../components/appointments/AppointmentSidebar";
import { AppointmentCalendar } from "../components/appointments/AppointmentCalendar";
import { AppointmentDetails } from "../components/appointments/AppointmentDetails";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUsersEvents } from "../helpers/services/event_services";
import { getCalendarList } from "../helpers/services/google_services";
import { listAccounts, listCalendars } from "../helpers/services/caldav_services";
import { startOfDay, endOfDay } from "date-fns";

interface Calendar {
    id: string;
    label: string;
    color: string;
    checked: boolean;
    type: 'google' | 'caldav';
    accountId?: string;
}

const Appointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [events, setEvents] = useState<Record<string, Event>>({});
    const [loading, setLoading] = useState(true);
    const [calendars, setCalendars] = useState<Calendar[]>([]);

    // View State
    const [date, setDate] = useState<Date>(new Date());
    const [view, setView] = useState<View>(Views.MONTH);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // Fetch calendars from Google and CalDAV
    useEffect(() => {
        const fetchCalendars = async () => {
            const calendarList: Calendar[] = [];

            try {
                // Fetch Google calendars
                const googleRes = await getCalendarList();
                console.log("Google calendars response:", googleRes.data);
                if (googleRes.data && Array.isArray(googleRes.data)) {
                    googleRes.data.forEach((cal: any, index: number) => {
                        calendarList.push({
                            id: `google-${cal.id}`,
                            label: cal.summary || cal.id,
                            color: cal.backgroundColor || (index === 0 ? "#3b82f6" : "#8b5cf6"),
                            checked: index === 0, // Check the first calendar by default
                            type: 'google'
                        });
                    });
                }
            } catch (err) {
                console.log("No Google calendars available", err);
            }

            try {
                // Fetch CalDAV accounts and their calendars
                const caldavAccounts = await listAccounts();
                console.log("CalDAV accounts response:", caldavAccounts.data);
                if (caldavAccounts.data && Array.isArray(caldavAccounts.data)) {
                    for (const account of caldavAccounts.data) {
                        try {
                            const calendarsRes = await listCalendars(account._id);
                            console.log(`Calendars for account ${account._id}:`, calendarsRes.data);
                            if (calendarsRes.data && Array.isArray(calendarsRes.data)) {
                                calendarsRes.data.forEach((cal: any) => {
                                    calendarList.push({
                                        id: `caldav-${account._id}-${cal.url}`,
                                        label: cal.displayName || cal.url,
                                        color: cal.color || "#a855f7",
                                        checked: false,
                                        type: 'caldav',
                                        accountId: account._id
                                    });
                                });
                            }
                        } catch (err) {
                            console.log(`Failed to fetch calendars for account ${account._id}`, err);
                        }
                    }
                }
            } catch (err) {
                console.log("No CalDAV calendars available", err);
            }

            // Add a default "My Appointments" calendar if no calendars were found
            if (calendarList.length === 0) {
                calendarList.push({
                    id: "my-appointments",
                    label: "My Appointments",
                    color: "var(--primary)",
                    checked: true,
                    type: 'google'
                });
            }

            console.log("Final calendar list:", calendarList);
            setCalendars(calendarList);
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

    const handleDateChange = (newDate: Date | undefined) => {
        if (newDate) setDate(newDate);
    };

    const handleCalendarToggle = (id: string) => {
        setCalendars(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
    };

    // Enrich appointments with event details
    const enrichedAppointments = appointments.map(apt => ({
        ...apt,
        eventDetails: events[apt.event]
    }));

    // Get dates that have appointments for highlighting
    const datesWithAppointments = new Set(
        appointments.map(apt => startOfDay(new Date(apt.start)).getTime())
    );

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
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
                            events={enrichedAppointments}
                            date={date}
                            onDateChange={setDate}
                            view={view}
                            onViewChange={setView}
                            onSelectEvent={setSelectedAppointment}
                        />
                    )}

                    <Button
                        size="icon"
                        className="absolute bottom-8 right-8 h-14 w-14 rounded-full shadow-lg shadow-primary/40 z-10"
                        onClick={() => {/* Navigate to /add-event or open modal */ }}
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </section>

                {selectedAppointment && (
                    <AppointmentDetails
                        appointment={selectedAppointment}
                        event={events[selectedAppointment.event]}
                        onClose={() => setSelectedAppointment(null)}
                    />
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Appointments;
