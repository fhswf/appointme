/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useTransition, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { defineStepper } from "@stepperize/react";

import { getUserByUrl } from "../helpers/services/user_services";
import { getEventByUrlAndUser, getAvailableTimes } from "../helpers/services/event_services";
import { Day, addMonths, addDays, addMinutes, format, startOfDay, endOfDay } from "date-fns";
import BookDetails from "../components/BookDetails";
import { insertIntoGoogle } from "../helpers/services/google_services";
import { EMPTY_EVENT, Event, IntervalSet } from "common";
import { UserDocument } from "../helpers/UserDocument";
import { useTranslation } from "react-i18next";
import { EventType } from "../components/EventType";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const { useStepper, steps } = defineStepper(
  { id: "date", title: "Choose date" },
  { id: "time", title: "Choose time" },
  { id: "details", title: "Provide details" }
);

type Details = { name: string; email: string; description: string };

const Booking = () => {
  const { t, i18n } = useTranslation();
  const data = useParams<{ user_url: string; url: string }>();
  const navigate = useNavigate();
  const stepper = useStepper();

  const [user, setUser] = useState<UserDocument>();
  const [event, setEvent] = useState<Event>(EMPTY_EVENT);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [beginDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<IntervalSet>();
  const [selectedTime, setSelectedTime] = useState<Date>();
  const [details, setDetails] = useState<Details>();
  const [, startTransition] = useTransition();

  const updateSlots = (startDate: Date) => {
    console.log("updateSlots called with", startDate);
    getAvailableTimes(
      startDate,
      addDays(addMonths(startDate, 6), 1),
      event.url,
      user!._id
    )
      .then((slots) => {
        console.log("slots %o", slots);
        setSlots(slots);
      })
      .catch((err) => {
        console.error("updateSlots error", err);
        toast.error("Could not get available time slots");
      });
  };

  useEffect(() => {
    if (!data.user_url || !data.url) return;

    getUserByUrl(data.user_url)
      .then((res) => {
        if (res.data.length === 0) {
          navigate("/notfound");
        } else {
          setUser(res.data);
          getEventByUrlAndUser(res.data._id, data.url!)
            .then((res) => {
              if (res.data == null) {
                navigate("/notfound");
              }
              if (res.data.isActive === false) {
                navigate("/notfound");
              } else {
                console.log("Setting event", res.data);
                setEvent(res.data);
              }
            })
            .catch((err) => {
              return err;
            });
        }
      })
      .catch((err) => {
        console.log("error getting user: %o", err);
        toast.error("Error getting user");
        return err;
      });
  }, [data.url, data.user_url, navigate]);

  useEffect(() => {
    console.log("Effect triggered: user=%o, event=%o", !!user, !!event?.url);
    if (user && event?.url) {
      startTransition(() => updateSlots(beginDate));
    }
  }, [beginDate, user, event]);

  const handleDateChange = (newValue: Date | undefined) => {
    if (!newValue) return;
    console.log("change date: %o", startOfDay(newValue));
    setSelectedDate(newValue);
    if (stepper.current.id === "date") {
      stepper.next();
    }
  };

  const checkDay = (date: Date) => {
    if (event.available) {
      return (
        date > new Date() &&
        event.available[date.getDay() as Day].length > 0 &&
        event.available[date.getDay() as Day][0].start !== "" &&
        slots?.overlapping({ start: startOfDay(date), end: endOfDay(date) }).length > 0
      );
    } else {
      return false;
    }
  };

  const getTimes = (day: Date) => {
    if (slots) {
      let times = [];
      const target = new IntervalSet(startOfDay(day), endOfDay(day));
      for (let slot of slots.intersect(target)) {
        let start = new Date(slot.start);
        let end = new Date(slot.end);
        let s = start;
        while (s < addMinutes(end, -event.duration)) {
          times.push(s);
          s = addMinutes(s, event.duration);
        }
      }
      return times;
    } else {
      return [];
    }
  };

  const handleTime = (time: Date) => () => {
    console.log("time: %o", time);
    setSelectedTime(time);
    if (stepper.current.id === "time") {
      stepper.next();
    }
  };

  const renderSlots = () => {
    if (!selectedDate) return null;
    const times = getTimes(selectedDate);
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">
          {i18n.t('clear_close_racoon_pat', { value: selectedDate })}
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {times.map((time) => (
            <Button
              key={time.toISOString()}
              variant={selectedTime && time.getTime() === selectedTime.getTime() ? "default" : "outline"}
              onClick={handleTime(time)}
              className="w-full"
              data-testid={time.toISOString()}
            >
              {format(time, "HH:mm")}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const handleDetailChange = (details: Details) => {
    console.log("details: %o", details);
    setDetails(details);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (user && details && selectedTime) {
      insertIntoGoogle(
        user._id,
        event,
        selectedTime,
        details.name,
        details.email,
        details.description
      )
        .then(() => {
          toast.success("Event successfully booked!");
          navigate(`/booked`, {
            state: { user, event, time: selectedTime },
          });
        })
        .catch((err) => {
          toast.error("Could not book event");
        });
    }
  };

  const currentStepIndex = stepper.all.findIndex(s => s.id === stepper.current.id);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">
        {t("Schedule an appointment")}
      </h1>

      <EventType event={event} user={user} time={selectedTime} />

      <div className="mt-8 border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
        <nav aria-label="Checkout Steps" className="group my-4">
          <ol className="flex items-center justify-between gap-2">
            {stepper.all.map((step, index, steps) => (
              <React.Fragment key={step.id}>
                <li className="flex items-center gap-4 flex-shrink-0">
                  <Button
                    type="button"
                    role="tab"
                    variant={index <= currentStepIndex ? "default" : "secondary"}
                    aria-current={stepper.current.id === step.id ? "step" : undefined}
                    aria-posinset={index + 1}
                    aria-setsize={steps.length}
                    aria-selected={stepper.current.id === step.id}
                    className="rounded-full w-10 h-10 p-0"
                    onClick={() => stepper.goTo(step.id)}
                  >
                    {index + 1}
                  </Button>
                  <span className="text-sm font-medium">{t(step.title)}</span>
                </li>
                {index < steps.length - 1 && (
                  <Separator className="flex-1" orientation="horizontal" />
                )}
              </React.Fragment>
            ))}
          </ol>
        </nav>

        <form onSubmit={handleSubmit} className="mt-8">
          {stepper.switch({
            date: () => (
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  disabled={(date) => !checkDay(date)}
                  className="rounded-md border"
                  modifiers={{
                    highlight: (date) => checkDay(date),
                  }}
                  modifiersClassNames={{
                    highlight: "font-bold text-primary",
                  }}
                />
              </div>
            ),
            time: () => (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="hidden md:block">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    disabled={(date) => !checkDay(date)}
                    className="rounded-md border"
                  />
                </div>
                <div>{renderSlots()}</div>
              </div>
            ),
            details: () => (
              <div className="space-y-6">
                {user && (
                  <BookDetails
                    errors={{}}
                    onChange={handleDetailChange}
                  />
                )}
                <div className="flex justify-end">
                  <Button type="submit" size="lg">
                    {t("whole_acidic_parrot_promise")}
                  </Button>
                </div>
              </div>
            ),
          })}

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={stepper.prev}
              disabled={stepper.isFirst}
              type="button"
            >
              {t("heroic_kind_llama_zip")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;
