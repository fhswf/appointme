import { useState, useEffect, FormEvent } from "react";
import { useHistory, useParams } from "react-router-dom";
import { StaticDatePicker, PickersDay } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Link,
  CircularProgress,
  Snackbar,
  Alert,
} from "@material-ui/core";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";

import { getUserByUrl } from "../helpers/services/user_services";
import { getEventByUrlAndUser } from "../helpers/services/event_services";
import { getAvailableTimes } from "../helpers/services/event_services";
import clsx from "clsx";
import {
  addDays,
  addMonths,
  isBefore,
  isAfter,
  isSameDay,
  startOfDay,
  endOfDay,
} from "date-fns";
//import de from "date-fns/locale/de";
import { de, enUS } from "date-fns/locale";
import BookDetails, { BookingFormData } from "../components/BookDetails";
import { insertIntoGoogle } from "../helpers/services/google_services";
import { Event, IntervalSet, TimeRange } from "@fhswf/bookme-common";
import { UserDocument } from "../helpers/UserDocument";
import ChooseTime from "../components/ChooseTime";
import { useTranslation, Trans } from "react-i18next";
import { HourglassTop, Room } from "@material-ui/icons";

const LOCALES = { en: enUS, de: de, "de-DE": de };

const useStyles = makeStyles((theme) => ({
  picker: {
    "& button": {
      borderRadius: "50%",
      "&.highlight": {
        "&.selected": {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          "&:hover, &:focus": {
            backgroundColor: theme.palette.primary.light,
          },
        },
        fontWeight: "bold",
        "&:hover, &:focus": {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.contrastText,
        },
      },
    },
  },

  date: {
    borderRadius: "50%",
  },
  header: {
    "&.MuiTypography-root": {
      marginTop: "16px",
      marginBottom: "8px",
    },
  },
  grid: {
    display: "grid",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
      gridTemplateAreas: `"header_l"  "picker_l" "header_r" "picker_r"`,
    },
    gridTemplateColumns: "1fr 1fr",
    gridTemplateAreas: `"header_l header_r" "picker_l picker_r"`,
    gap: 2,
    alignItems: "start",
    padding: 2,
  },
  root: {
    width: "100%",
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    padding: "16px 0 0",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  spacer: {
    flex: "1 1 auto",
  },
  instructions: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  description: {
    display: "inline-block",
    "&p": {
      display: "inline-block",
    },
  },
  textBottom: {
    verticalAlign: "text-bottom",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "1.5em 1fr",
    gridGap: theme.spacing(1),
    alignItems: "center",
    paddingBottom: "16px",
  },
  item: {},
  slots: {
    maxHeight: "300px",
  },
}));

type Error = {
  message: string;
} & any;

const Schedule = (props: any) => {
  const param = useParams<{ user_url: string; url: string }>();
  const history = useHistory();
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const [user, setUser] = useState<UserDocument>();
  const [event, setEvent] = useState<Event>();
  //let user: UserDocument = null;
  //let event: Event = null;

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimeRange | null>(null);
  const [beginDate, setBeginDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<IntervalSet>(new IntervalSet());
  const [daySlots, setDaySlots] = useState<IntervalSet>(new IntervalSet());
  const [details, setDetails] = useState<BookingFormData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [validationErrors, setValidationErrors] = useState<any>({});

  if (!user) {
    getUserByUrl(param.user_url).then((res) => {
      if (res.data.length === 0) {
        history.push("/notfound");
      } else {
        setUser(res.data);
      }
    });
  }

  if (user && !event) {
    getEventByUrlAndUser(user._id, param.url).then((res) => {
      if (res.data == null) {
        history.push("/notfound");
      }
      if (res.data.isActive === false) {
        history.push("/notfound");
      } else {
        setEvent(res.data);
      }
    });
  }

  useEffect(() => {
    if (user && event && event.url) {
      getAvailableTimes(
        beginDate,
        addDays(addMonths(beginDate, 1), 1),
        event.url,
        user._id
      )
        .then((slots) => {
          console.log("slots %o", slots);
          setSlots(slots);
        })
        .catch((err) => {
          setError({
            message: "could not get available time slots",
            details: err,
          });
        });
    }
  }, [beginDate, event, user]);

  useEffect(() => {
    if (slots && slots.length > 0) {
      if (selectedDate == null) {
        console.log("setDate: %o", slots[0].start);
        let dayInt = new IntervalSet(
          startOfDay(slots[0].start),
          endOfDay(slots[0].start)
        );
        setDaySlots(dayInt.intersect(slots));
        setSelectedDate(slots[0].start);
      }
    }
  }, [selectedDate, slots]);

  const handleErrorClose = () => {
    history.push("/");
  };

  const checkDay = (date: Date) => {
    if (date < new Date()) {
      return false;
    }
    let available = false;
    if (slots) {
      slots.forEach((slot) => {
        if (
          isSameDay(slot.start, date) ||
          isSameDay(slot.end, date) ||
          (isBefore(slot.start, date) && isAfter(slot.end, date))
        ) {
          available = true;
        }
      });
    }
    return available;
  };

  const renderPickerDay = (
    date: Date,
    selectedDates: any,
    pickersDayProps: any
  ) => {
    return (
      <PickersDay
        {...pickersDayProps}
        disableMargin
        disabled={!checkDay(date)}
        className={clsx({
          [classes.date]: true,
          selected: selectedDate && isSameDay(date, selectedDate),
          highlight: checkDay(date),
        })}
      />
    );
  };

  const handleMonthChange = (date: Date) => {
    setBeginDate(date);
  };

  const handleDateChange = (newValue: Date) => {
    console.log("date: %o", newValue);
    if (user) {
      let dayInt = new IntervalSet(startOfDay(newValue), endOfDay(newValue));
      setDaySlots(dayInt.intersect(slots));
      setSelectedDate(newValue);
    }
  };

  const handleTimeChange = (time: TimeRange) => {
    console.log("select slot: %o", time);
    //history.push(window.location.pathname, { selectedTime });
    window.history.pushState({ time }, "Enter Details");
    setSelectedTime(time);
  };

  window.onpopstate = (evt) => {
    console.log("popState: %o %o", evt, evt.state);
    if (evt.state) {
      setSelectedTime(evt.state.time);
    } else {
      setSelectedTime(null);
    }
  };

  const handleDetailChange = (data: BookingFormData) => {
    console.log("detailchange: %o", data);
    setDetails(data);
  };

  const handleInvalid = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    console.log("formInvalid: %o", e);

    if (e.target instanceof HTMLElement) {
      const element = e.target;
      if (element.id) {
        setValidationErrors({ ...validationErrors, [element.id]: e.type });
      }
    }
  };

  const handleSubmit = (e) => {
    console.log("submit: %o", details);
    e.preventDefault();

    insertIntoGoogle(
      user._id,
      event,
      selectedTime.start,
      details.name,
      details.email,
      details.description
    )
      .then(() => {
        history.push({
          pathname: `/booked`,
          state: { user, event, time: selectedTime },
        });
      })
      .catch((err) =>
        setError({ message: "failed to schedule appointment", details: err })
      );
  };

  //const userName = user ? user.name : "";

  console.log("langue: %s", i18n.language);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      locale={LOCALES[i18n.language]}
    >
      <Container>
        {user && event ? (
          selectedTime ? (
            <>
              <Typography variant="h5">{t("Confirm meeting")}</Typography>
              <Typography>
                {selectedDate.toLocaleDateString(i18n.language, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                {selectedTime.start.toLocaleTimeString(i18n.language, {
                  timeStyle: "short",
                })}{" "}
                –{" "}
                {selectedTime.end.toLocaleTimeString(i18n.language, {
                  timeStyle: "short",
                })}{" "}
                <Link onClick={() => setSelectedTime(null)}>{t("Change")}</Link>
              </Typography>

              <form onSubmit={handleSubmit} onInvalid={handleInvalid}>
                <BookDetails
                  userid={user._id}
                  username={user.name}
                  event={event}
                  start={selectedTime.start}
                  end={selectedTime.end}
                  errors={validationErrors}
                  onChange={handleDetailChange}
                />
                <Grid container justifyContent="space-between" padding={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => history.goBack()}
                  >
                    {t("Back")}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    name="submit"
                    type="submit"
                  >
                    {t("Confirm &amp; Book")}
                  </Button>
                </Grid>
              </form>
            </>
          ) : (
            <Box className={classes.grid} padding={2}>
              <Box
                sx={{ gridColumn: "1 / span 2", gridRow: "1" }}
                justifySelf="center"
                justifyItems="center"
              >
                <Avatar
                  alt={user ? user.name : ""}
                  src={user ? user.picture_url : ""}
                  sx={{ width: 72, height: 72, margin: "auto" }}
                />
                <Box display="grid" justifyItems="center">
                  <Typography variant="h5">
                    {t("Meeting with")} {user.name}
                  </Typography>
                  <Typography variant="h4">{event.description}</Typography>
                  <Box display="flex" flexWrap="wrap">
                    <Typography variant="body1" className={classes.description}>
                      <HourglassTop className={classes.textBottom} />{" "}
                      {event.duration} {t("minutes")}
                    </Typography>
                    <Typography variant="body1" className={classes.description}>
                      <Room className={classes.textBottom} />
                      {event.location}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ gridArea: "picker_l" }}>
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  value={selectedDate}
                  className={classes.picker}
                  onChange={handleDateChange}
                  onMonthChange={handleMonthChange}
                  renderDay={renderPickerDay}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" />
                  )}
                />
              </Box>

              <Box sx={{ gridArea: "header_r" }} alignSelf="end"></Box>
              <Box
                sx={{ gridArea: "picker_r" }}
                display="flex"
                flexWrap="wrap"
                gap={2}
                padding={2}
              >
                <Typography>
                  {selectedDate ? (
                    <>
                      <Trans i18nKey="availableSlots">
                        The following times are available on
                        {{
                          date: selectedDate.toLocaleDateString(i18n.language, {
                            day: "numeric",
                            month: "long",
                          }),
                        }}
                        . You may pick one or choose a different date.
                      </Trans>
                    </>
                  ) : (
                    <>Please choose a date to check available times.</>
                  )}
                </Typography>
                <ChooseTime
                  slots={daySlots}
                  duration={event.duration}
                  language={i18n.language}
                  onSelect={handleTimeChange}
                />
              </Box>
            </Box>
          )
        ) : (
          <Box display="flex" alignContent="center">
            <Typography textAlign="center">Loading user</Typography>
            <CircularProgress />
          </Box>
        )}
      </Container>
      <Snackbar open={error != null} autoHideDuration={6000}>
        {error ? (
          <Alert onClose={handleErrorClose} severity="error" className="error">
            Error: {error.message}{" "}
            {"details" in error && "message" in error.details
              ? ": " + error.details.message
              : ""}
          </Alert>
        ) : (
          <></>
        )}
      </Snackbar>
    </LocalizationProvider>
  );
};

export default Schedule;
