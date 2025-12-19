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

interface AppointmentWithEvent extends Appointment {
    eventDetails?: Event;
}

interface AppointmentCalendarProps {
    events: AppointmentWithEvent[]
    date: Date
    onDateChange: (date: Date) => void
    view: View
    onViewChange: (view: View) => void
    onSelectEvent: (event: Appointment) => void
}

const CustomToolbar = ({ date, onNavigate, onView, view, label }: ToolbarProps) => {
    return (
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-4">
                <div className="flex items-center bg-secondary rounded-lg p-0.5 border border-border">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onNavigate('PREV')}
                        className="h-8 w-8 hover:bg-background"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNavigate('TODAY')}
                        className="px-4 font-semibold text-foreground bg-background shadow-sm hover:bg-background"
                    >
                        Today
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onNavigate('NEXT')}
                        className="h-8 w-8 hover:bg-background"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <h2 className="text-xl font-bold text-foreground">{label}</h2>
            </div>

            <div className="flex bg-secondary rounded-lg p-1 border border-border">
                <Button
                    variant={view === Views.MONTH ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => onView(Views.MONTH)}
                    className={cn("px-4 py-1.5 h-8 text-sm", view === Views.MONTH && "bg-background shadow-sm text-primary")}
                >
                    Month
                </Button>
                <Button
                    variant={view === Views.WEEK ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => onView(Views.WEEK)}
                    className={cn("px-4 py-1.5 h-8 text-sm", view === Views.WEEK && "bg-background shadow-sm text-primary")}
                >
                    Week
                </Button>
                <Button
                    variant={view === Views.DAY ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => onView(Views.DAY)}
                    className={cn("px-4 py-1.5 h-8 text-sm", view === Views.DAY && "bg-background shadow-sm text-primary")}
                >
                    Day
                </Button>
            </div>
        </div>
    )
}

const CustomEvent = ({ event }: { event: AppointmentWithEvent }) => {
    // If we have eventDetails, use the name, otherwise fallback
    const title = event.eventDetails?.name || event.description || "Appointment";

    return (
        <div className="h-full w-full bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-1.5 overflow-hidden rounded-r-md text-xs hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <div className="font-semibold text-primary-foreground dark:text-blue-100 truncate">
                {title}
            </div>
            <div className="text-[10px] text-muted-foreground truncate">
                {format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}
            </div>
        </div>
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

    // Transform events if needed for RBC (it expects start/end as Date objects)
    const calendarEvents = events.map(evt => ({
        ...evt,
        start: new Date(evt.start),
        end: new Date(evt.end),
        title: evt.eventDetails?.name || evt.description || "Appointment"
    }))

    return (
        <div className="flex-1 h-full bg-background relative overflow-hidden flex flex-col">
            <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                date={date}
                onNavigate={onDateChange}
                view={view}
                onView={onViewChange}
                onSelectEvent={onSelectEvent}
                components={{
                    toolbar: CustomToolbar as any, // RBC types for CustomToolbar are sometimes tricky
                    event: CustomEvent as any
                }}
                // Styling overrides
                className="font-sans text-foreground"
            />
        </div>
    )
}
