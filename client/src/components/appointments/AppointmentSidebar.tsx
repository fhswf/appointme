import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppointmentSidebarProps {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
    calendars: { id: string; label: string; color: string; checked: boolean }[]
    onCalendarToggle: (id: string) => void
}

export function AppointmentSidebar({
    date,
    setDate,
    calendars,
    onCalendarToggle,
}: AppointmentSidebarProps) {
    return (
        <aside className="w-72 bg-card border-r border-border flex flex-col p-6 overflow-y-auto hidden lg:flex">
            <div className="bg-secondary/30 rounded-xl p-4 mb-6 shadow-sm border border-border">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border-none shadow-none p-0 w-full"
                    classNames={{
                        month: "space-y-4 w-full",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        row: "flex w-full mt-2",
                        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: cn(
                            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                        ),
                        day_selected:
                            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground",
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
                <div className="space-y-3">
                    {calendars.map((calendar) => (
                        <div key={calendar.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={calendar.id}
                                checked={calendar.checked}
                                onCheckedChange={() => onCalendarToggle(calendar.id)}
                                className={cn(
                                    "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
                                    // We might want custom colors later, but for now primary is good or we use style prop
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
            </div>
        </aside>
    )
}
