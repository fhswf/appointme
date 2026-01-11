import { Event } from "common";
import { useTranslation } from "react-i18next";
import { Clock, MapPin, Calendar } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PublicEventCardProps {
    event: Event;
    onClick: (event: Event) => void;
    index?: number;
}

const GRADIENTS = [
    "from-blue-500 to-indigo-500",
    "from-emerald-500 to-teal-500",
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-rose-500 to-red-500",
];

const ICONS_BG = [
    "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400",
];

const TEXT_HOVER = [
    "group-hover:text-blue-600 dark:group-hover:text-blue-400",
    "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    "group-hover:text-purple-600 dark:group-hover:text-purple-400",
    "group-hover:text-amber-600 dark:group-hover:text-amber-400",
    "group-hover:text-rose-600 dark:group-hover:text-rose-400",
];

export const PublicEventCard = ({ event, onClick, index = 0 }: PublicEventCardProps) => {
    const { t } = useTranslation();

    // Deterministic color selection based on index or string hash if needed
    const colorIndex = index % GRADIENTS.length;

    return (
        <button
            type="button"
            className="group relative flex flex-col w-full text-left bg-card rounded-xl shadow-sm hover:shadow-md border border-border transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full cursor-pointer"
            onClick={() => onClick(event)}
        >
            {/* Top Gradient Border */}
            <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${GRADIENTS[colorIndex]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
            />

            <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={`h-12 w-12 rounded-lg flex items-center justify-center transition-colors ${ICONS_BG[colorIndex]}`}>
                            {/* Placeholder icon logic - can be refined based on event type if needed */}
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold text-foreground transition-colors ${TEXT_HOVER[colorIndex]}`}>
                                {event.name}
                            </h3>
                            {/* Optional: Add a subtitle or category if 'tags' are used for it */}
                            {event.tags && event.tags.length > 0 && (
                                <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mt-0.5">
                                    {event.tags[0]}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                    {event.description}
                </p>

                <div className="space-y-3 mt-auto">
                    <div className="flex items-center text-sm text-foreground">
                        <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                        <span>
                            {event.duration} {t("minutes")}
                            {event.recurrence?.enabled && (
                                <span> • {t("Recurring")}: {t(event.recurrence.frequency)}</span>
                            )}
                        </span>
                    </div>
                    <div className="flex items-center text-sm text-foreground">
                        <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                        <span>{event.location || t("Online Meeting")}</span>
                    </div>

                </div>
            </div>

            <div className="p-6 pt-0 mt-auto">
                <div
                    className={cn(buttonVariants({ variant: "default" }), "w-full justify-center group-hover:bg-primary/90")}
                >
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{t("Book Appointment")}</span>
                </div>
            </div>
        </button>
    );
};
