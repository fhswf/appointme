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
  User,
  Video,
  Mail,
  MapPin,
  MessageSquare,
  Edit,
  FileText
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
  
  // Use event name if available, otherwise fallback. But usually appointment.event is just an ID.
  const title = event?.name || "Appointment";

  return (
    <aside className="w-80 bg-card border-l border-border flex flex-col shadow-xl z-20 h-full absolute right-0 top-0 lg:static lg:h-auto animate-accordion-down lg:animate-none">
      <div className="px-6 py-5 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-lg">Details</h3>
        <div className="flex gap-2">
            {onEdit && (
                <Button variant="ghost" size="icon" onClick={() => onEdit(appointment)} className="text-muted-foreground hover:text-foreground">
                    <Edit2 className="h-4 w-4" />
                </Button>
            )}
            {onDelete && (
                <Button variant="ghost" size="icon" onClick={() => onDelete(appointment._id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
            </Button>
        </div>
      </div>

      <div className="p-6 overflow-y-auto flex-1 space-y-8">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            Confirmed
          </span>
          <h2 className="text-2xl font-bold text-foreground leading-tight mb-2">
            {title}
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <CalendarIcon className="h-4 w-4" />
            <span>{format(start, "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
            <Clock className="h-4 w-4" />
            <span>
              {format(start, "h:mm a")} - {format(end, "h:mm a")}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              ({duration}m)
            </span>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-4">
            Attendee
          </h4>
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10 border border-border">
                {/* Placeholder image or initial */}
                <AvatarImage src="" /> 
                <AvatarFallback>{appointment.attendeeName ? appointment.attendeeName.charAt(0).toUpperCase() : "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">
                {appointment.attendeeName || "Unknown Attendee"}
              </p>
              <a
                href={`mailto:${appointment.attendeeEmail}`}
                className="text-sm text-primary hover:underline break-all"
              >
                {appointment.attendeeEmail}
              </a>
              <div className="flex items-center gap-2 mt-2">
                 {/* Placeholder buttons as per UX, no functionality yet */}
                <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                    View Profile
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                    Message
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 rounded-lg p-4 border border-border">
          <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">
            Event Type
          </h4>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
               {event?.location && event.location.toLowerCase().includes('meet') ? <Video className="h-4 w-4"/> : <MapPin className="h-4 w-4" />}
            </div>
            <div>
              <p className="text-sm font-semibold">{event?.location || "No Location Defined"}</p>
              <p className="text-xs text-muted-foreground">
                {event?.location ? "Location details" : "Video call details not set"}
              </p>
            </div>
          </div>
          {event?.location && (
               <Button variant="outline" className="w-full mt-3 h-8 text-xs">
                Join / View Map
               </Button>
          )}
        </div>

        {appointment.description && (
            <div>
            <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">
                Notes
            </h4>
            <div className="flex gap-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{appointment.description}"
                </p>
            </div>
            </div> 
        )}
      </div>

      <div className="p-6 border-t border-border bg-card/50">
        <Button className="w-full gap-2" size="lg">
          <Edit className="h-4 w-4" />
          Reschedule Appointment
        </Button>
      </div>
    </aside>
  )
}
