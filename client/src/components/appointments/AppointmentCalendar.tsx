import { Calendar, dateFnsLocalizer, Views, ToolbarProps, View } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
// import 'react-big-calendar/lib/css/react-big-calendar.css' // Moved to index.css
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Appointment, Event } from "common"
import { cn } from "@/lib/utils"

const locales = {
    'en-US': enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

interface CalendarEvent {
    id?: string;
    title: string;
    start: Date;
    end: Date;
    resource?: any;
}

interface AppointmentCalendarProps {
    events: CalendarEvent[]
    date: Date
    onDateChange: (date: Date) => void
    view: View
    onViewChange: (view: View) => void
    onSelectEvent: (event: any) => void
}

const CustomToolbar = ({ date, onNavigate, onView, view, label }: ToolbarProps) => {
    return (
<div className = "px-6 py-4 border-b border-border flex items-center justify-between bg-card">
<div className = "flex items-center gap-4">
<div className = "flex items-center bg-secondary rounded-lg p-0.5 border border-border">
<Button
variant = "ghost"
size = "icon"
onClick = {() => onNavigate('PREV')}
className = "h-8 w-8 hover:bg-background"
>
<ChevronLeft className = "h-4 w-4" />
< / Button>
<Button
variant = "ghost"
size = "sm"
onClick = {() => onNavigate('TODAY')}
className = "px-4 font-semibold text-foreground bg-background shadow-sm hover:bg-background"
>
Today
< / Button>
<Button
variant = "ghost"
size = "icon"
onClick = {() => onNavigate('NEXT')}
className = "h-8 w-8 hover:bg-background"
>
<ChevronRight className = "h-4 w-4" />
< / Button>
< / div>
<h2 className = "text-xl font-bold text-foreground">{ label } < / h2>
< / div>

<div className = "flex bg-secondary rounded-lg p-1 border border-border">
<Button
variant = { view === Views.MONTH ? "outline" : "ghost"}
size = "sm"
onClick = {() => onView(Views.MONTH)}
className = { cn("px-4 py-1.5 h-8 text-sm", view === Views.MONTH && "bg-background shadow-sm text-primary")}
>
Month
< / Button>
<Button
variant = { view === Views.WEEK ? "outline" : "ghost"}
size = "sm"
onClick = {() => onView(Views.WEEK)}
className = { cn("px-4 py-1.5 h-8 text-sm", view === Views.WEEK && "bg-background shadow-sm text-primary")}
>
Week
< / Button>
<Button
variant = { view === Views.DAY ? "outline" : "ghost"}
size = "sm"
onClick = {() => onView(Views.DAY)}
className = { cn("px-4 py-1.5 h-8 text-sm", view === Views.DAY && "bg-background shadow-sm text-primary")}
>
Day
< / Button>
< / div>
< / div>
    )
}

const CustomEvent = ({ event }: { event: CalendarEvent }) => {
    const isCalendarEvent = event.resource?.type === 'calendar';
    const isAppointment = event.resource?.type === 'appointment';
    const bgColor = isCalendarEvent && event.resource?.color
        ? event.resource.color
        : '#3b82f6';

    // Get initials for appointment events
    const getInitials = () => {
        if (isAppointment && event.resource?.data?.attendee?.name) {
            const name = event.resource.data.attendee.name;
            const parts = name.split(' ');
            if (parts.length >= 2) {
                return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
        }
        return null;
    };

    const initials = getInitials();

    // Determine background colors based on event type
    const backgroundColor = isCalendarEvent
        ? `${bgColor}15`
        : 'hsl(var(--card))'; // Use theme card color for appointments

    const ringColor = isCalendarEvent
        ? `${bgColor}30`
        : 'hsl(var(--border))';

    return (
<div
className = {
    cn(
                "h-full w-full border-l-4 p-2 overflow-hidden rounded-md text-xs",
                "shadow-md hover:shadow-lg cursor-pointer",
                "transform hover:-translate-y-0.5 transition-all duration-200",
                "ring-1"
    )
}
style = {{
    backgroundColor,
        borderLeftColor: bgColor,
            ringColor
}}
>
<div className = "flex items-start justify-between gap-1">
<div className = "flex-1 min-w-0">
<h4
className = "text-xs font-bold leading-tight mb-0.5 truncate"
style = {{
    color: isCalendarEvent ? bgColor : 'hsl(var(--foreground))'
}}
>
{ event.title }
< / h4>
<p className = "text-[10px] text-muted-foreground truncate">
{ format(event.start, "h:mm a") } - { format(event.end, "h:mm a") }
< / p>
< / div>
{
    initials && (
    <div
    className = "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
    style = {{
        backgroundColor: `${bgColor}20`,
            color: bgColor
    }
}
>
{ initials }
< / div>
                )}
< / div>
< / div>
    )
}


export function AppointmentCalendar({
    events,
    date,
    onDateChange,
    view,
    onViewChange,
    onSelectEvent
}: AppointmentCalendarProps) {

    return (
    <div className = "flex-1 flex flex-col bg-background overflow-hidden h-full">
    <Calendar
    localizer = { localizer }
    events = { events }
    startAccessor = "start"
    endAccessor = "end"
    style = {{ height: '100%', flex: 1 }
}
date = { date }
onNavigate = { onDateChange }
view = { view }
onView = { onViewChange }
onSelectEvent = { onSelectEvent }
components = {{
    toolbar: CustomToolbar as any,
        event: CustomEvent as any
}}
className = "font-sans text-foreground"
    />
< / div>
    )
}
