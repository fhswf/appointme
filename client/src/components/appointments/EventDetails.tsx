import * as React from "react"
import { X, Calendar, Clock, MapPin, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface EventDetailsProps {
    event: any
    onClose: () => void
}

export function EventDetails({ event, onClose }: EventDetailsProps) {
    const startDate = new Date(event.start?.dateTime || event.start);
    const endDate = new Date(event.end?.dateTime || event.end);

    return (
        <aside className="w-96 bg-card border-l border-border flex flex-col overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-card border-b border-border p-6 flex items-start justify-between">
                <div className="flex-1 pr-4">
                    <h2 className="text-xl font-bold text-foreground mb-1">
                        {event.summary || event.title || 'Event'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Calendar Event
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full hover:bg-secondary"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Date & Time */}
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                                {format(startDate, 'EEEE, MMMM d, yyyy')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-foreground">
                                {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Duration: {Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} minutes
                            </p>
                        </div>
                    </div>
                </div>

                {/* Location */}
                {event.location && (
                    <div className="flex items-start gap-3 pt-3 border-t border-border">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                            <p className="text-sm text-foreground">
                                {event.location}
                            </p>
                        </div>
                    </div>
                )}

                {/* Description */}
                {event.description && (
                    <div className="flex items-start gap-3 pt-3 border-t border-border">
                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                            <p className="text-sm text-foreground whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </div>
                    </div>
                )}

                {/* Calendar Source */}
                <div className="pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: event.calendarColor || '#3b82f6' }}
                        />
                        <p className="text-xs text-muted-foreground">
                            Read-only calendar event
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
