import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Event, User } from 'common';
import { Hourglass, MapPin, CalendarClock } from 'lucide-react';
import { format } from 'date-fns';
import { enUS, de, fr, es, it, ja, ko, zhCN } from 'date-fns/locale';


export type EventTypeProps = {
    event: Event;
    user: User;
    time: Date | undefined;
    handleOnClick?: (event: Event) => void | undefined;
};

export const EventType = (props: EventTypeProps) => {
    const { event, user, time, handleOnClick } = props;
    const { t, i18n } = useTranslation();


    console.log("EventType: event=%o, user=%o, time=%o", event, user, time);
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                    <AvatarImage src={user?.picture_url} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex items-center gap-4">
                    <Hourglass className="h-5 w-5 text-muted-foreground" />
                    <span>{event.duration + t("equal_jolly_thrush_empower")}</span>
                </div>
                <div className="flex items-center gap-4">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>{event.location}</span>
                </div>
                {time && (
                    <div className="flex items-center gap-4">
                        <CalendarClock className="h-5 w-5 text-muted-foreground" />
                        <span>
                            <span>
                                {format(time, "Pp", {
                                    locale: (() => {
                                        switch (i18n.language) {
                                            case 'de': return de;
                                            case 'fr': return fr;
                                            case 'es': return es;
                                            case 'it': return it;
                                            case 'ja': return ja;
                                            case 'ko': return ko;
                                            case 'zh': return zhCN;
                                            default: return enUS;
                                        }
                                    })()
                                })}
                            </span>

                        </span>
                    </div>
                )}
            </CardContent>

            {handleOnClick && (
                <CardFooter>
                    <Button
                        onClick={(evt) => {
                            evt.preventDefault();
                            handleOnClick(event);
                        }}
                        className="w-full"
                    >
                        <CalendarClock className="mr-2 h-4 w-4" />
                        {t("petty_swift_piranha_rise")}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};
