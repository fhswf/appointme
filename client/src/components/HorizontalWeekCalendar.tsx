import React, { useRef, useEffect } from "react";
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks, isBefore, startOfDay } from "date-fns";
import { useTranslation } from "react-i18next";
import { getLocale } from "@/helpers/date_locales";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HorizontalWeekCalendarProps {
    selectedDate: Date | undefined;
    onSelect: (date: Date) => void;
    className?: string;
    isDayAvailable?: (date: Date) => boolean;
}

const HorizontalWeekCalendar: React.FC<HorizontalWeekCalendarProps> = ({
    selectedDate,
    onSelect,
    className,
    isDayAvailable,
}) => {
    const { i18n } = useTranslation();
    const [currentWeekStart, setCurrentWeekStart] = React.useState(() =>
        startOfWeek(selectedDate || new Date(), { weekStartsOn: 1 })
    );

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Sync week view if selectedDate changes externally to a different week
    useEffect(() => {
        if (selectedDate) {
            const selectedWeekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
            if (!isSameDay(selectedWeekStart, currentWeekStart)) {
                setCurrentWeekStart(selectedWeekStart);
            }
        }
    }, [selectedDate]);

    const locale = getLocale(i18n.language);

    const handlePrevWeek = () => {
        setCurrentWeekStart((prev) => subWeeks(prev, 1));
    };

    const handleNextWeek = () => {
        setCurrentWeekStart((prev) => addWeeks(prev, 1));
    };

    const days = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-bold">
                    {format(currentWeekStart, "MMMM yyyy", { locale })}
                </h3>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full w-8 h-8"
                        onClick={handlePrevWeek}
                        disabled={isBefore(addWeeks(currentWeekStart, 1), startOfDay(new Date()))} // Disable if previous week is entirely in past
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full w-8 h-8"
                        onClick={handleNextWeek}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="grid grid-cols-7 gap-1 pb-2 w-full"
            >
                {days.map((day) => {
                    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                    const isPast = isBefore(day, startOfDay(new Date()));
                    const isAvailable = isDayAvailable ? isDayAvailable(day) : true;
                    const isDisabled = isPast || !isAvailable;

                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => !isDisabled && onSelect(day)}
                            disabled={isDisabled}
                            className={cn(
                                "flex flex-col items-center justify-center h-[72px] rounded-xl transition-all border w-full",
                                isSelected
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 transform scale-105 border-primary z-10"
                                    : isAvailable
                                        ? "bg-accent/10 border-accent/20 font-semibold"
                                        : "bg-card text-card-foreground border-border hover:border-primary",
                                isDisabled && "opacity-50 cursor-not-allowed border-transparent bg-transparent font-normal"
                            )}
                        >
                            <span className={cn(
                                "text-[10px] sm:text-xs font-medium uppercase",
                                isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                            )}>
                                {format(day, "EE", { locale })}
                            </span>
                            <span className="text-base sm:text-lg font-bold leading-none">
                                {format(day, "d", { locale })}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default HorizontalWeekCalendar;
