import React from "react";
import { useTranslation } from "react-i18next";
import { LocalizedTimeInput } from "./LocalizedTimeInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import { Day, Slot, Slots } from "common";
import { t } from "i18next";

type EditSlotProps = {
    day: Day;
    slots: Slot[];
    onChange: (slots: Slot[]) => void;
};

// Internal type with ID for React keys
type SlotWithId = Slot & { _id: string };

const EditSlot = (props: EditSlotProps) => {
    const { i18n } = useTranslation();
    const [slots, setSlots] = React.useState<SlotWithId[]>([]);

    React.useEffect(() => {
        // Create a content-only version of current state for comparison
        const currentContent = slots.map(({ _id, ...rest }) => rest);
        
        // Only update from props if the content is actually different
        // This prevents regenerating IDs (and losing focus/state) when the parent
        // echoes back the same data we just sent.
        if (JSON.stringify(currentContent) !== JSON.stringify(props.slots || [])) {
            setSlots((props.slots || []).map(s => ({
                ...s,
                _id: Math.random().toString(36).substring(2, 9)
            })));
        }
        // We purposefully omit 'slots' from dependencies to avoid reverting 
        // local changes before the parent has caught up.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.slots]);

    const hasActiveSlots = slots.length > 0;

    const handleCheck = (checked: boolean) => {
        if (checked) {
            // ensure at least one entry
            if (slots.length === 0) {
                const newSlot = { start: "09:00", end: "17:00" };
                const _slots = [{ ...newSlot, _id: Math.random().toString(36).substring(2, 9) }];
                setSlots(_slots);
                props.onChange([newSlot]);
            }
        } else if (slots.length > 0) {
            setSlots([]);
            props.onChange([]);
        }
    };

    const addSlot = () => {
        const newSlot = { start: "", end: "" };
        const _slots = [...slots, { ...newSlot, _id: Math.random().toString(36).substring(2, 9) }];
        setSlots(_slots);
        props.onChange(_slots.map(({ _id, ...rest }) => rest));
    };

    const deleteSlot = (id: string) => () => {
        const _slots = slots.filter((slot) => slot._id !== id);
        setSlots(_slots);
        props.onChange(_slots.map(({ _id, ...rest }) => rest));
    };

    const changeTime =
        (key: keyof Slot, id: string) =>
            (val: string) => {
                const _slots = slots.map(slot =>
                    slot._id === id ? { ...slot, [key]: val } : slot
                );
                setSlots(_slots);
                props.onChange(_slots.map(({ _id, ...rest }) => rest));
            };

    const getDayName = (day: Day) => {
        // Jan 5, 2025 is a Sunday. Day enum is 0 for Sunday.
        const date = new Date(2025, 0, 5 + day);
        return date.toLocaleString(i18n.language, { weekday: 'short' });
    };

    return (
        <div className="grid grid-cols-12 gap-4 items-start py-2 border-b last:border-0">
            <div className="col-span-2 flex items-center space-x-2 pt-2">
                <Checkbox
                    id={`day-${props.day}`}
                    checked={hasActiveSlots}
                    onCheckedChange={handleCheck}
                />
                <Label htmlFor={`day-${props.day}`} className="font-medium">
                    {getDayName(props.day)}
                </Label>
            </div>
            <div className="col-span-9 space-y-2">
                {slots.map((slot) => (
                    <div key={slot._id} className="flex items-center gap-2">
                        <div className="w-1/3">
                            <LocalizedTimeInput
                                placeholder={t("Starttime")}
                                onChange={changeTime("start", slot._id)}
                                value={slot.start}
                            />
                        </div>
                        <span className="text-muted-foreground">–</span>
                        <div className="w-1/3">
                            <LocalizedTimeInput
                                placeholder={t("Endtime")}
                                onChange={changeTime("end", slot._id)}
                                value={slot.end}
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={deleteSlot(slot._id)}
                            type="button"
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <div className="col-span-1 pt-1">
                {hasActiveSlots && (
                    <Button variant="ghost" size="icon" onClick={addSlot} type="button">
                        <Plus className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export interface AvailabilityEditorProps {
    available: Slots;
    onChange: (available: Slots) => void;
    className?: string;
}

export const AvailabilityEditor = ({ available, onChange, className }: AvailabilityEditorProps) => {

    const onChangeSlot = (day: Day) => (slots: Slot[]) => {
        const newAvailable = { ...available };
        newAvailable[day] = slots;
        onChange(newAvailable);
    };

    // Ensure we have entries for all days
    const safeAvailable = available || {
        [Day.MONDAY]: [],
        [Day.TUESDAY]: [],
        [Day.WEDNESDAY]: [],
        [Day.THURSDAY]: [],
        [Day.FRIDAY]: [],
        [Day.SATURDAY]: [],
        [Day.SUNDAY]: [],
    };

    return (
        <div className={`border rounded-lg p-4 space-y-2 ${className || ''}`}>
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                <EditSlot
                    key={day}
                    day={day}
                    slots={safeAvailable[day as Day]}
                    onChange={onChangeSlot(day)}
                />
            ))}
        </div>
    );
};
