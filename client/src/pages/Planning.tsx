import { useEffect, useState } from "react";

import { useParams, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardContent,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import HourglassFullIcon from "@material-ui/icons/HourglassFull";
import ScheduleIcon from "@material-ui/icons/Schedule";
import RoomIcon from "@material-ui/icons/Room";

import { getActiveEvents } from "../helpers/services/event_services";
import { getUserByUrl } from "../helpers/services/user_services";
import { EventDocument } from "../helpers/EventDocument";
import { UserDocument } from "../helpers/UserDocument";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "grid",
    gridTemplateColumns: "1.5em 1fr",
    gridGap: theme.spacing(1),
    alignItems: "center",
    verticalAlign: "center",
    paddingBottom: "16px",
  },
  item: {},
}));

const Planning = (props: any) => {
  const history = useHistory();
  const classes = useStyles();

  const { user_url } = useParams<{ user_url: string }>();
  const [events, setEvents] = useState<EventDocument[]>([]);
  const [user, setUser] = useState({
    name: "",
    welcome: "",
    picture_url: "",
  });

  useEffect(() => {
    getUserByUrl(user_url)
      .then((res) => {
        if (res.data.length === 0) {
          history.push("/notfound");
        } else {
          setUser(res.data);
          getActiveEvents(res.data._id)
            .then((res) => {
              console.log(res.data);
              if (res.data.length === 0) {
                setUser({
                  name: user.name,
                  welcome: "No active Events",
                  picture_url: "",
                });
              } else {
                setEvents(res.data);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user_url, history]);

  const handleOnClick = (bookingEvent: EventDocument) => {
    history.push({
      pathname: `/users/${user_url}/${bookingEvent.url}`,
      state: { bookingEvent, user },
    });
  };

  const renderEventlist = () => {
    if (!events || events.length == 0) {
      return <h4 className="noevents">No events to book</h4>;
    } else {
      return (
        <Grid
          container
          spacing={3}
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          {events.map((event) => (
            <Grid item>
              <Card>
                <CardHeader
                  avatar={<Avatar alt={user.name} src={user.picture_url} />}
                  action={
                    <IconButton
                      aria-label="schedule"
                      onClick={(evt) => {
                        evt.preventDefault();
                        handleOnClick(event);
                      }}
                    >
                      <ScheduleIcon />
                    </IconButton>
                  }
                  title={event.name}
                />
                <CardContent>
                  <div className={classes.container}>
                    <div className={classes.item}>
                      <HourglassFullIcon />
                    </div>
                    <div className={classes.item}>
                      {event.duration + " minutes"}
                    </div>

                    <div className={classes.item}>
                      <RoomIcon />
                    </div>
                    <div className={classes.item}>{event.location}</div>
                  </div>
                  {event.description}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Schedule an appointment with {user.name}
      </Typography>
      Please select the type of appointment you need and click on the schedule
      button to book it. You will get a list of available slots in my schedule.
      <Box p="1em">{renderEventlist()}</Box>
    </Container>
  );
};

export default Planning;
