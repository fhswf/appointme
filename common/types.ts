

/** Enum type representing a day of week.
 *  The ordering is compatible with the native `Date.prototype.getDay()`, which uses 0 for Sunday.
 */
export enum Day {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY
}

export const DayNames = {
  [Day.MONDAY]: "Mon",
  [Day.TUESDAY]: "Tue",
  [Day.WEDNESDAY]: "Wed",
  [Day.THURSDAY]: "Thu",
  [Day.FRIDAY]: "Fri",
  [Day.SATURDAY]: "Sat",
  [Day.SUNDAY]: "Sun",
};

export type Slot = {
  start: string;
  end: string;
};

export type Slots = Record<Day, Slot[]>;

export type Event = {
  user: string;
  name: string;
  location: string;
  description: string;
  duration: number;
  isActive: boolean;
  url: string;
  rangedays: number;
  calendardays: boolean;
  bufferafter: number;
  bufferbefore: number;
  available: Slots;
};

export const EMPTY_EVENT: Event = {
  user: "",
  name: "",
  location: "",
  description: "",
  duration: 0,
  isActive: false,
  url: "",
  rangedays: 0,
  calendardays: false,
  bufferafter: 0,
  bufferbefore: 0,
  available: {
    [Day.MONDAY]: [],
    [Day.TUESDAY]: [],
    [Day.WEDNESDAY]: [],
    [Day.THURSDAY]: [],
    [Day.FRIDAY]: [],
    [Day.SATURDAY]: [],
    [Day.SUNDAY]: [],
  },
};

export interface GoogleTokens extends Document {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  expiry_date?: number;
}

export interface User {
  email: string;
  name: string;
  password: string;
  user_url: string;
  picture_url: string;
  google_tokens: GoogleTokens;
  push_calendar: string;
  pull_calendars: string[];
};
