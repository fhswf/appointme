import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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

// Mock calendars for the sidebar
const MOCK_CALENDARS = [
    { id: "me", label: "My Calendar", color: "var(--primary)", checked: true },
    { id: "team", label: "Team Events", color: "#a855f7", checked: true },
];

const Appointments = () => {
    const { t } = useTranslation();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [events, setEvents] = useState<Record<string, Event>>({});
    const [loading, setLoading] = useState(true);

    // View State
    const [date, setDate] = useState<Date>(new Date());
    const [view, setView] = useState<View>(Views.MONTH);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [calendars, setCalendars] = useState(MOCK_CALENDARS);

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
                    evtRes.data.forEach((evt: Event) => {
                        if (evt._id) eventMap[evt._id] = evt;
                    });
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

    return (
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
            <AppNavbar />

            <main className="flex-1 flex overflow-hidden relative">
                <AppointmentSidebar
                    date={date}
                    setDate={handleDateChange}
                    calendars={calendars}
                    onCalendarToggle={handleCalendarToggle}
                />

                <section className="flex-1 flex flex-col h-full bg-background overflow-hidden relative border-l border-border">
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
                        // Add logic to open "Add Event" modal or navigate to add page
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
                    // Add handlers for edit/delete if needed
                    />
                )}
            </main>
        </div>
    );
};

export default Appointments;
