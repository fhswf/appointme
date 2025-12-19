import { format, differenceInMinutes } from "date-fns"
import { Appointment, Event } from "common"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  X,
  Edit2,
  Trash2,
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  FileText,
  Edit
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AppointmentDetailsProps {
  appointment: Appointment | null
  event?: Event
  onClose: () => void
  onDelete?: (id: string) => void
  onEdit?: (appointment: Appointment) => void
}

export function AppointmentDetails({
  appointment,
  event,
  onClose,
  onDelete,
  onEdit
}: AppointmentDetailsProps) {
  if (!appointment) return null

  const start = new Date(appointment.start)
  const end = new Date(appointment.end)
  const duration = differenceInMinutes(end, start)

  // Use event name as the title (e.g., "Sprechstunde")
  const eventTitle = event?.name || "Appointment"

  // Event description from the Event type (not the appointment description)
  const eventDescription = event?.description

  // Appointment description is the attendee's notes/information
  const attendeeNotes = appointment.description

  return (
    <aside className="w-80 bg-card border-l border-border flex flex-col shadow-xl z-20 h-full absolute right-0 top-0 lg:static lg:h-auto">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-card sticky top-0 z-10">
        <h3 className="font-semibold text-lg">Details</h3>
        <div className="flex gap-2">
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(appointment)} className="text-muted-foreground hover:text-foreground">
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon" onClick={() => onDelete(appointment._id!)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        {/* Event Type Title and Status */}
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            Confirmed
          </span>
          <h2 className="text-2xl font-bold text-foreground leading-tight mb-4">
            {eventTitle}
          </h2>

          {/* Event Description (from Event Type) */}
          {eventDescription && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {eventDescription}
            </p>
          )}

          {/* Date and Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{format(start, "EEEE, MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {format(start, "h:mm a")} - {format(end, "h:mm a")}
              </span>
              <span className="text-xs text-muted-foreground">
                ({duration} min)
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Location/Meeting Info */}
        {(event?.location || appointment.location) && (
          <div className="bg-secondary/30 rounded-lg p-4 border border-border">
            <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3">
              Location
            </h4>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {(event?.location || appointment.location || '').toLowerCase().includes('meet') ||
                  (event?.location || appointment.location || '').toLowerCase().includes('zoom') ||
                  (event?.location || appointment.location || '').toLowerCase().includes('teams') ?
                  <Video className="h-4 w-4" /> :
                  <MapPin className="h-4 w-4" />
                }
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {event?.location || appointment.location}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(event?.location || appointment.location || '').toLowerCase().includes('meet') ||
                    (event?.location || appointment.location || '').toLowerCase().includes('zoom') ||
                    (event?.location || appointment.location || '').toLowerCase().includes('teams') ?
                    'Video conference' :
                    'In-person meeting'
                  }
                </p>
              </div>
            </div>
            {((event?.location || appointment.location || '').toLowerCase().includes('http') ||
              (event?.location || appointment.location || '').toLowerCase().includes('meet') ||
              (event?.location || appointment.location || '').toLowerCase().includes('zoom')) && (
                <Button variant="outline" className="w-full mt-3 h-9 text-xs font-medium">
                  Join Meeting
                </Button>
              )}
          </div>
        )}

        {/* Attendee Information */}
        <div>
          <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3">
            Attendee
          </h4>
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 border border-border shrink-0">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {appointment.attendeeName ? appointment.attendeeName.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">
                {appointment.attendeeName || "Unknown Attendee"}
              </p>
              <a
                href={`mailto:${appointment.attendeeEmail}`}
                className="text-sm text-primary hover:underline block truncate"
              >
                {appointment.attendeeEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Attendee Notes/Information */}
        {attendeeNotes && (
          <div>
            <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3">
              Attendee Information
            </h4>
            <div className="bg-secondary/20 rounded-lg p-4 border border-border">
              <div className="flex gap-3">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm text-foreground leading-relaxed">
                  {attendeeNotes}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-border bg-secondary/10">
        <Button className="w-full gap-2 h-11" size="lg">
          <Edit className="h-4 w-4" />
          Reschedule Appointment
        </Button>
      </div>
    </aside>
  )
}
