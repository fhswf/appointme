
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, CardActions, CardContent, CardHeader, Avatar } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Event, User } from 'common';
import { HourglassBottomTwoTone, RoomTwoTone } from '@mui/icons-material';
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';

export type EventTypeProps = {
    event: Event;
    user: User;
    time: Date | undefined;
    handleOnClick?: (event: Event) => void | undefined;
};

export const EventType = (props: EventTypeProps) => {
    const { event, user, time, handleOnClick } = props;
    const { t } = useTranslation();

    console.log("EventType: event=%o, user=%o, time=%o", event, user, time);
    return (<Card>
        <CardHeader
            avatar={<Avatar alt={user?.name} src={user?.picture_url} />}
            title={event.name}
            titleTypographyProps={{ variant: 'h5' }}
            subheader={event.description}
        />
        <CardContent>
            <Grid
                sx={{
                    display: "grid",
                    paddingLeft: "0",
                    paddingRight: "0",
                    gridTemplateColumns: "32px 1fr",
                    alignItems: "stretch"
                }}>
                <Grid sx={{
                    //justifySelf: "center"
                }}>
                    <HourglassBottomTwoTone />
                </Grid>
                <div>
                    {event.duration + t("equal_jolly_thrush_empower")}
                </div>
                <Grid sx={{
                    //justifySelf: "center"
                }}>
                    <RoomTwoTone />
                </Grid>
                <div>
                    {event.location}
                </div>
                {
                    time ?
                        <>
                            <Grid sx={{
                                //justifySelf: "center"
                            }}>
                                <ScheduleTwoToneIcon />
                            </Grid>
                            <div>
                                {time.toLocaleDateString()} {time.toLocaleTimeString()}
                            </div>
                        </> : null
                }
            </Grid>

        </CardContent>

        {
            handleOnClick ?
                <CardActions>
                    <Button
                        color="primary"
                        aria-label="schedule"
                        onClick={(evt) => {
                            evt.preventDefault();
                            handleOnClick(event);
                        }}
                        startIcon={<ScheduleTwoToneIcon />}
                    >
                        {t("petty_swift_piranha_rise")}
                    </Button>
                </CardActions> : null
        }
    </Card>);

}
