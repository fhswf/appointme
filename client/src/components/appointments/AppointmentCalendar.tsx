import { Calendar, dateFnsLocalizer, Views, ToolbarProps, View } from 'react-big-calendar'
import { format } from 'date-fns/format'
import { parse } from 'date-fns/parse'
import { startOfWeek } from 'date-fns/startOfWeek'
import { getDay } from 'date-fns/getDay'
import { de, enUS, es, fr, it, ja, ko, zhCN } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Appointment, Event } from "common"
import { cn } from "@/lib/utils"

const locales = {
    'en-US': enUS,
    'en': enUS,
    'de': de,
    'es': es,
    'fr': fr,
    'it': it,
    'ja': ja,
    'ko': ko,
    'zh': zhCN
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
    backgroundEvents?: CalendarEvent[]
    date: Date
    onDateChange: (date: Date) => void
    view: View
    onViewChange: (view: View) => void
    onSelectEvent: (event: any) => void
}

const CustomToolbar = ({ date, onNavigate, onView, view, label }: ToolbarProps) => {
    const { t } = useTranslation();
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
                        className="px-4 font-semibold text-foreground bg-card shadow-sm hover:bg-card"
                    >
                        {t('today')}
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
                    className={cn("px-4 py-1.5 h-8 text-sm", view === Views.MONTH && "bg-card shadow-sm text-primary")}
                >
                    {t('month')}
                </Button>
                <Button
                    variant={view === Views.WEEK ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => onView(Views.WEEK)}
                    className={cn("px-4 py-1.5 h-8 text-sm", view === Views.WEEK && "bg-card shadow-sm text-primary")}
                >
                    {t('week')}
                </Button>
                <Button
                    variant={view === Views.DAY ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => onView(Views.DAY)}
                    className={cn("px-4 py-1.5 h-8 text-sm", view === Views.DAY && "bg-card shadow-sm text-primary")}
                >
                    {t('day')}
                </Button>
            </div>
        </div>
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

    const { i18n } = useTranslation();
    const currentLocale = locales[i18n.language as keyof typeof locales] || enUS;
    return (
        <div
            className={cn(
                "h-full w-full border-l-4 p-2 overflow-hidden rounded-md text-xs",
                "shadow-md hover:shadow-lg cursor-pointer",
                "transform hover:-translate-y-0.5 transition-all duration-200",
                "ring-1"
            )}
            style={{
                backgroundColor,
                borderLeftColor: bgColor,
                ['--ring-color' as any]: ringColor
            }}
        >
            <div className="flex items-start justify-between gap-1">
                <div className="flex-1 min-w-0">
                    <h4
                        className="text-xs font-bold leading-tight mb-0.5 truncate"
                        style={{
                            color: isCalendarEvent ? bgColor : 'hsl(var(--foreground))'
                        }}
                    >
                        {event.title}
                    </h4>
                    <p className="text-[10px] text-muted-foreground truncate">
                        {format(event.start, "p", { locale: currentLocale })} - {format(event.end, "p", { locale: currentLocale })}
                    </p>
                </div>
                {initials && (
                    <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{
                            backgroundColor: `${bgColor}20`,
                            color: bgColor
                        }}
                    >
                        {initials}
                    </div>
                )}
            </div>
        </div>
    )
}

const MonthEvent = ({ event }: { event: CalendarEvent }) => {
    const isCalendarEvent = event.resource?.type === 'calendar';
    const bgColor = isCalendarEvent && event.resource?.color
        ? event.resource.color
        : '#3b82f6';

    const style: React.CSSProperties = {
        backgroundColor: isCalendarEvent ? bgColor : 'hsl(var(--primary))',
        color: '#fff',
        opacity: isCalendarEvent ? 0.9 : 1,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 4px',
        fontSize: '11px',
        lineHeight: 'inherit',
        overflow: 'hidden'
    };

    return (
        <div style={style} title={event.title}>
            <span className="font-semibold mr-1 whitespace-nowrap">
                {format(event.start, "HH:mm")}
            </span>
            <span className="truncate whitespace-nowrap">
                {event.title}
            </span>
        </div>
    )
}

export function AppointmentCalendar({
    events,
    backgroundEvents,
    date,
    onDateChange,
    view,
    onViewChange,
    onSelectEvent
}: AppointmentCalendarProps) {

    const { t, i18n } = useTranslation();

    const eventPropGetter = (event: CalendarEvent) => {
        return {
            className: "custom-rbc-event",
            style: {
                backgroundColor: 'transparent',
                border: 'none',
                padding: 0,
                outline: 'none'
            }
        }
    }

    return (
        <div className="flex-1 flex flex-col bg-background overflow-hidden h-full">
            <Calendar
                localizer={localizer}
                events={events}
                backgroundEvents={backgroundEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%', flex: 1 }}
                date={date}
                onNavigate={onDateChange}
                view={view}
                onView={onViewChange}
                onSelectEvent={onSelectEvent}
                eventPropGetter={eventPropGetter}
                messages={{
                    showMore: (total) => t('n_more', { count: total })
                }}
                popup
                components={{
                    toolbar: CustomToolbar as any,
                    event: CustomEvent as any,
                    month: {
                        event: MonthEvent as any
                    }
                }}
                className="font-sans text-foreground"
                scrollToTime={new Date(1970, 1, 1, 8, 0, 0)}
                culture={i18n.language}
                formats={{
                    timeGutterFormat: (date: Date, culture: any, localizer: any) =>
                        localizer.format(date, 'p', culture),
                    eventTimeRangeFormat: ({ start, end }: any, culture: any, localizer: any) =>
                        `${localizer.format(start, 'p', culture)} - ${localizer.format(end, 'p', culture)}`,
                    agendaTimeRangeFormat: ({ start, end }: any, culture: any, localizer: any) =>
                        `${localizer.format(start, 'p', culture)} - ${localizer.format(end, 'p', culture)}`,
                }}
            />
        </div>
    )
}
