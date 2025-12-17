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

const EditSlot = (props: EditSlotProps) => {
    const { i18n } = useTranslation();
    const [slots, setSlots] = React.useState<Slot[]>([]);

    React.useEffect(() => {
        setSlots(props.slots || []);
    }, [props.slots]);

    const hasActiveSlots = slots.length > 0;


    const handleCheck = (checked: boolean) => {
        if (checked) {
            // ensure at least one entry
            if (slots.length === 0) {
                const _slots = [{ start: "09:00", end: "17:00" }];
                setSlots(_slots);
                props.onChange(_slots);
            }
        } else if (slots.length > 0) {
            setSlots([]);
            props.onChange([]);
        }
    };

    const addSlot = () => {
        const _slots = slots.slice();
        _slots.push({ start: "", end: "" });
        setSlots(_slots);
        props.onChange(_slots);
    };

    const deleteSlot = (index: number) => () => {
        // console.log("delete slot %d", index);
        const _slots = slots.filter((slot, idx) => index !== idx);
        setSlots(_slots);
        props.onChange(_slots);
    };

    const changeTime =
        (key: keyof Slot, index: number) =>
            (val: string) => {
                // console.log("ChangeTime: %s %d %o", key, index, val);
                const _slots = slots.slice();
                _slots[index] = { ..._slots[index], [key]: val };
                setSlots(_slots);
                props.onChange(_slots);
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
                {slots.map((slot, index) => (
                    <div key={`${index}`} className="flex items-center gap-2">
                        <div className="w-1/3">
                            <LocalizedTimeInput
                                placeholder={t("Starttime")}
                                onChange={changeTime("start", index)}
                                value={slot.start}
                            />
                        </div>
                        <span className="text-muted-foreground">–</span>
                        <div className="w-1/3">
                            <LocalizedTimeInput
                                placeholder={t("Endtime")}
                                onChange={changeTime("end", index)}
                                value={slot.end}
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={deleteSlot(index)}
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
