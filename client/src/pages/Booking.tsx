/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useTransition, useEffect, FormEvent } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useParams } from "react-router-dom";
import { defineStepper } from "@stepperize/react";

import { getUserByUrl } from "../helpers/services/user_services";
import { getEventByUrlAndUser, getAvailableTimes } from "../helpers/services/event_services";
import { Day, addMonths, addDays, addMinutes, format, startOfDay, endOfDay } from "date-fns";
import { getLocale } from "../helpers/date_locales";

import BookDetails from "../components/BookDetails";
import { insertEvent } from "../helpers/services/google_services";
import { EMPTY_EVENT, Event, IntervalSet } from "common";
import { UserDocument } from "../helpers/UserDocument";
import { useTranslation } from "react-i18next";
import { EventType } from "../components/EventType";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LanguageSelector } from "../components/LanguageSelector";
import Footer from "../components/Footer";
import HorizontalWeekCalendar from "../components/HorizontalWeekCalendar";
import { ChevronLeft, Globe, Clock, MapPin, Video } from "lucide-react";




import { useAuth } from "../components/AuthProvider";

const { useStepper, steps } = defineStepper(
  { id: "schedule", title: "Schedule Appointment" },
  { id: "details", title: "Provide details" }
);


type Details = { name: string; email: string; description: string };

const Booking = () => {
  const { t, i18n } = useTranslation();
  const data = useParams<{ user_url: string; url: string }>();
  const navigate = useNavigate();
  const stepper = useStepper();
  const auth = useAuth(); // Get auth context

  const [user, setUser] = useState<UserDocument>();
  const [event, setEvent] = useState<Event>(EMPTY_EVENT);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [beginDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<IntervalSet>();
  const [slotMessage, setSlotMessage] = useState<string>();
  const [selectedTime, setSelectedTime] = useState<Date>();
  const [details, setDetails] = useState<Details>();
  const [, startTransition] = useTransition();

  // Pre-fill details from auth user (LTI or regular)
  useEffect(() => {
    if (auth.user) {
      setDetails((prev) => {
        if (prev) return prev;
        return {
          name: auth.user!.name || "",
          email: auth.user!.email || "",
          description: "",
        };
      });
    } else {
      // Check for transient user if not authenticated
      import("../helpers/services/user_services").then((services) => {
        services
          .getTransientUser()
          .then((res) => {
            if (res.data) {
              setDetails((prev) => {
                if (prev) return prev;
                return {
                  name: res.data.name || "",
                  email: res.data.email || "",
                  description: "",
                };
              });
            }
          })
          .catch((err) => {
            // Ignore 401, just means no transient user
          });
      });
    }
  }, [auth.user]);

  const updateSlots = (startDate: Date) => {
    getAvailableTimes(
      startDate,
      addDays(addMonths(startDate, 6), 1),
      (event as any)._id
    )
      .then((res) => {
        setSlots(res.slots);
        setSlotMessage(res.message);

        // Auto-select first available date
        if (event.available && !selectedDate) {
          // Look for first date with slots starting from today
          let iterator = startOfDay(new Date());
          const end = addMonths(iterator, 6);

          // Simple loop to find first day with availability
          while (iterator < end) {
            if (hasAvailableSlots(iterator, slots)) {
              const newDate = new Date(iterator);
              setSelectedDate(newDate);
              setCurrentMonth(newDate);
              break;
            }
            iterator = addDays(iterator, 1);
          }
        }
      })
      .catch((err) => {
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
    if (user && event?.url) {
      startTransition(() => updateSlots(beginDate));
    }
  }, [beginDate, user, event]);

  const handleDateChange = (newValue: Date | undefined) => {
    if (!newValue) return;

    setSelectedDate(newValue);
    // No stepper navigation needed on date change anymore as it is same step
  };

  const hasAvailableSlots = (date: Date, slots: IntervalSet | undefined) => {
    if (!slots) return false;

    const daySlots = slots.intersect(new IntervalSet(startOfDay(date), endOfDay(date)));
    for (const slot of daySlots) {
      const start = new Date(slot.start);
      const end = new Date(slot.end);
      // Check if at least one event of duration fits in this slot
      if (addMinutes(start, event.duration) <= end) {
        return true;
      }
    }
    return false;
  };

  const checkDay = (date: Date) => {
    return date > new Date() && hasAvailableSlots(date, slots);
  };

  const getTimes = (day: Date) => {
    if (slots) {
      const times = [];
      const target = new IntervalSet(startOfDay(day), endOfDay(day));
      for (const slot of slots.intersect(target)) {
        const start = new Date(slot.start);
        const end = new Date(slot.end);
        let s = start;
        // Fix loop condition to include the last valid slot
        while (s <= addMinutes(end, -event.duration)) {
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

    setSelectedTime(time);

    // Auto-advance to details when time is selected on desktop
    if (stepper.current.id === "schedule") {
      stepper.next();
    }
  };

  const handleMobileTimeSelect = (time: Date) => {
    setSelectedTime(time);
    // Don't auto-advance stepper on mobile immediate click, waiting for 'Next' button or if date/time are merged step.
    // Actually, our stepper has separated steps. If we merge them in UI, we need to handle stepper state carefully.
    // For mobile, we can treat "Date" and "Time" as one visual phase.
    if (stepper.current.id === "schedule") stepper.next();
  };


  const renderSlots = (isMobile = false) => {
    if (!selectedDate) return null;
    const times = getTimes(selectedDate);

    if (times.length === 0) {
      return <div className="text-muted-foreground text-sm p-4 text-center">{t("No slots available")}</div>
    }

    return (
      <div className="flex flex-col gap-4">
        {!isMobile && (
          <h2 className="text-lg font-medium">
            {i18n.t('clear_close_racoon_pat', { value: format(selectedDate, "P", { locale: getLocale(i18n.language) }) })}
          </h2>
        )}
        <div className={isMobile ? "grid grid-cols-3 gap-3" : "grid grid-cols-3 gap-2"}>
          {times.map((time) => (
            <Button
              key={time.toISOString()}
              variant={selectedTime && time.getTime() === selectedTime.getTime() ? "default" : "outline"}
              onClick={isMobile ? () => handleMobileTimeSelect(time) : handleTime(time)}
              className={isMobile ? "h-12 w-full rounded-lg text-sm font-semibold shadow-sm" : "w-full"}
              data-testid={time.toISOString()}
            >
              {format(time, "p", { locale: getLocale(i18n.language) })}
            </Button>

          ))}
        </div>
      </div>
    );
  };

  const handleDetailChange = (details: Details) => {

    setDetails(details);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (user && details && selectedTime) {
      insertEvent(
        (event as any)._id,
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
          toast.error(t("Could not book event"));
        });
    }
  };

  const currentStepIndex = stepper.all.findIndex(s => s.id === stepper.current.id);

  // New helper for cn import if not present
  const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans flex flex-col overflow-x-hidden w-full">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center bg-background p-4 justify-between sticky top-0 z-20 shadow-sm border-b">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-base font-bold leading-tight tracking-tight flex-1 text-center truncate px-2">
          {event?.name || t("Schedule Appointment")}
        </h2>
        <div className="w-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => i18n.changeLanguage('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => i18n.changeLanguage('de')}>
                Deutsch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-4xl flex-grow flex flex-col">
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {t("Schedule an appointment")}
          </h1>
          <LanguageSelector />
        </div>


        <div className="hidden md:block">
          <EventType event={event} user={user} time={selectedTime} />
        </div>

        {/* Mobile Compact Event Card */}
        <div className="md:hidden mb-6">
          <div className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm border">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center text-primary/80">
              <Video className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <p className="text-foreground text-base font-bold leading-tight line-clamp-1">{event?.name}</p>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {event?.duration} Min
                    {event?.recurrence?.enabled && (
                      <span> • {t("Recurring")}: {t(event.recurrence.frequency)}</span>
                    )}
                  </span>
                </div>
                {/* Location placeholder - add to Event type later if needed */}
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:mt-8 md:border md:rounded-lg md:p-6 md:bg-card md:text-card-foreground md:shadow-sm flex-grow">
          {/* Desktop Stepper */}
          <nav aria-label="Checkout Steps" className="group my-4 hidden md:block">
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
                    <span className="text-sm font-medium hidden sm:block">{t(step.title)}</span>
                  </li>
                  {index < steps.length - 1 && (
                    <Separator className="flex-1" orientation="horizontal" />
                  )}
                </React.Fragment>
              ))}
            </ol>
          </nav>

          {/* Mobile Steps Indicator */}
          <form onSubmit={handleSubmit} className="mt-4 md:mt-8 flex flex-col flex-grow">
            <div className="flex w-full flex-col items-center justify-center py-4 md:hidden">
              <div className="flex flex-row gap-2">
                {/* Simplified visual indicator for mobile */}
                <div className={cn("h-1.5 rounded-full transition-all", stepper.current.id === 'schedule' ? "w-8 bg-primary" : "w-2 bg-muted")}></div>
                <div className={cn("h-1.5 rounded-full transition-all", stepper.current.id === 'details' ? "w-8 bg-primary" : "w-2 bg-muted")}></div>
              </div>
            </div>

            {stepper.switch({
              schedule: () => (
                <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
                  {slotMessage && (
                    <div className="md:col-span-2 bg-yellow-100 border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
                      <strong className="font-bold">{t("Notice")}: </strong>
                      <span className="block sm:inline">{t(slotMessage)}</span>
                    </div>
                  )}
                  {/* Desktop Calendar */}
                  <div className="hidden md:block">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      month={currentMonth}
                      onMonthChange={setCurrentMonth}
                      disabled={(date) => !checkDay(date)}
                      className="rounded-md border"
                    />
                  </div>

                  {/* Desktop Slots - Only show if date selected */}
                  <div className="hidden md:block">
                    {selectedDate ? renderSlots() : (
                      <div className="h-full flex items-center justify-center text-muted-foreground border rounded-md bg-muted/10 p-8">
                        {t("Please select a date")}
                      </div>
                    )}
                  </div>

                  {/* Mobile View - Horizontal Calendar */}
                  <div className="md:hidden flex flex-col gap-6">
                    <HorizontalWeekCalendar
                      selectedDate={selectedDate}
                      onSelect={handleDateChange}
                      isDayAvailable={checkDay}
                    />
                    {/* Show slots immediately below calendar on mobile if date selected */}
                    {selectedDate && (
                      <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="tracking-tight text-lg font-bold leading-tight text-left">
                          {t("Available Times")}
                          <span className="block text-sm font-normal text-muted-foreground mt-1">
                            {format(selectedDate, "EEEE, d. MMMM", { locale: getLocale(i18n.language) })}
                          </span>
                        </h3>
                        {renderSlots(true)}
                      </div>
                    )}
                  </div>
                </div>
              ),
              details: () => (
                <div className="flex flex-col gap-6">
                  {selectedDate && selectedTime && (
                    <div className="bg-muted/30 p-4 rounded-lg border border-border flex flex-col gap-2">
                      <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">
                        {t("Appointment Summary")}
                      </h3>
                      <div className="flex items-center gap-2 text-sm md:text-lg font-medium">
                        <Clock className="w-5 h-5 text-primary" />
                        <span>
                          {format(selectedDate, "EEEE, d. MMMM yyyy", { locale: getLocale(i18n.language) })}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span>{format(selectedTime, "p", { locale: getLocale(i18n.language) })}</span>
                      </div>
                    </div>
                  )}
                  {user && (
                    <BookDetails
                      errors={{}}
                      onChange={handleDetailChange}
                      initialValues={details}
                    />
                  )}
                  {/* Desktop Submit Button Position */}
                  <div className="hidden md:flex justify-end">
                    <Button type="submit" size="lg">
                      {t("whole_acidic_parrot_promise")}
                    </Button>
                  </div>
                </div>
              ),
            })}

            {/* Desktop Navigation Buttons */}
            {stepper.current.id === 'details' && (
              <div className="mt-8 hidden md:flex justify-between">
                <Button
                  variant="outline"
                  onClick={stepper.prev}
                  disabled={stepper.isFirst}
                  type="button"
                >
                  {t("heroic_kind_llama_zip")}
                </Button>
              </div>
            )}

            {/* Mobile Sticky Footer */}
            {stepper.current.id !== 'details' && selectedTime && (
              <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t z-30">
                <Button
                  type="button"
                  onClick={() => stepper.goTo('details')}
                  className="w-full h-12 text-base font-bold shadow-lg flex items-center justify-center gap-2"
                >
                  {t("Continue")}
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                </Button>
              </div>
            )}
            {stepper.current.id === 'details' && (
              <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t z-30">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={stepper.prev}
                    className="h-12 w-12 shrink-0 p-0 rounded-lg border-2"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 text-base font-bold shadow-lg"
                  >
                    {t("Book Appointment")}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Booking;
