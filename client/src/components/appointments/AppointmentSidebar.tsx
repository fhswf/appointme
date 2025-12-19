import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { startOfDay } from "date-fns"

interface AppointmentSidebarProps {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
    calendars: { id: string; label: string; color: string; checked: boolean }[]
    onCalendarToggle: (id: string) => void
    datesWithAppointments: Set<number>
}

export function AppointmentSidebar({
    date,
    setDate,
    calendars,
    onCalendarToggle,
    datesWithAppointments
}: AppointmentSidebarProps) {
    console.log("AppointmentSidebar received calendars:", calendars);
    
    return (
        <aside className="w-72 bg-card border-r border-border flex flex-col p-6 overflow-y-auto hidden lg:flex">
            <div className="bg-secondary/30 rounded-xl p-4 mb-6 shadow-sm border border-border">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border-none shadow-none p-0 w-full"
                    modifiers={{
                        hasAppointment: (day) => datesWithAppointments.has(startOfDay(day).getTime())
                    }}
                    modifiersClassNames={{
                        hasAppointment: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary"
                    }}
                    classNames={{
                        month: "space-y-3 w-full",
                        table: "w-full border-collapse",
                        head_row: "flex w-full",
                        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem]",
                        row: "flex w-full mt-1",
                        cell: "h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: cn(
                            "h-8 w-8 p-0 font-normal text-sm aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                        ),
                        day_selected:
                            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground font-semibold",
                        day_outside: "text-muted-foreground opacity-50",
                        day_disabled: "text-muted-foreground opacity-50",
                        day_range_middle:
                            "aria-selected:bg-accent aria-selected:text-accent-foreground",
                        day_hidden: "invisible",
                    }}
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Calendars
                </h3>
                {calendars.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                        No calendars connected
                    </p>
                ) : (
                    <div className="space-y-3">
                        {calendars.map((calendar) => (
                            <div key={calendar.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={calendar.id}
                                    checked={calendar.checked}
                                    onCheckedChange={() => onCalendarToggle(calendar.id)}
                                    className={cn(
                                        "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    )}
                                    style={{
                                        backgroundColor: calendar.checked ? calendar.color : undefined,
                                        borderColor: calendar.color
                                    }}
                                />
                                <Label
                                    htmlFor={calendar.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {calendar.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    )
}
