import { Button } from "@/components/ui/button";
import { MessageSquare, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeToggle";
import * as Sentry from "@sentry/react";

interface FabSpeedDialProps {
    className?: string;
}

export function FabSpeedDial({ className }: Readonly<FabSpeedDialProps>) {
    const { theme, toggleTheme } = useTheme();

    const handleFeedback = async () => {
        const feedback = Sentry.getFeedback();
        console.log("feedback: %o", feedback);
        if (feedback) {
            const form = await feedback?.createForm();
            form.appendToDom();
            form.open();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 flex flex-col-reverse items-center gap-3 z-50 group">
            {/* Main Trigger (Theme Toggle) */}
            <Button
                size="icon"
                onClick={toggleTheme}
                className={`h-14 w-14 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110 z-20 ${className || "bg-primary text-primary-foreground hover:bg-primary/90"}`}
                aria-label="Toggle theme"
                title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
                {theme === "light" ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </Button>

            {/* Actions (Feedback) - Slides up on group hover */}
            <div
                className="flex flex-col gap-3 transition-all duration-300 ease-out opacity-0 translate-y-4 scale-75 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto"
            >
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFeedback}
                    className="h-12 w-12 rounded-full shadow-md bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-foreground"
                    title="Give Feedback"
                >
                    <MessageSquare className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
