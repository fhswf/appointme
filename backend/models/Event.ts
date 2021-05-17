import { Document, Schema, model } from 'mongoose';
import { Day, Event, Slot, Slots } from '@fhswf/bookme-common'




export interface EventDocument extends Event, Document<Event> { }

const eventSchema = new Schema<EventDocument>({
  user: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    default: "No explizit Location",
    trim: true,
  },

  description: {
    type: String,
    default: "",
    trim: true,
  },

  /** duration of the event (in minutes) */
  duration: {
    type: Number,
    required: true,
    default: 15,
  },

  url: {
    type: String,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: false,
  },

  rangedays: {
    type: Number,
    default: 30,
  },

  calendardays: {
    type: Boolean,
    default: true,
  },

  /** reserved buffer before an event (in minutes) */
  bufferbefore: {
    type: Number,
    default: 0,
  },

  /** reserved buffer after an event (in minutes) */
  bufferafter: {
    type: Number,
    default: 0,
  },

  available: {
    [Day.SUNDAY]: {
      type: Array,
      default: [{ start: "8:00", end: "17:00" }],
    },
    [Day.MONDAY]: {
      type: Array,
      default: [{ start: "8:00", end: "17:00" }],
    },
    [Day.TUESDAY]: {
      type: Array,
      default: [{ start: "8:00", end: "17:00" }],
    },
    [Day.WEDNESDAY]: {
      type: Array,
      default: [{ start: "8:00", end: "17:00" }],
    },
    [Day.THURSDAY]: {
      type: Array,
      default: [{ start: "8:00", end: "17:00" }],
    },
    [Day.FRIDAY]: {
      type: Array,
      default: [{ start: "8:00", end: "17:00" }],
    },
    [Day.SATURDAY]: {
      type: Array,
      default: [{ start: "8:00", end: "17:00" }],
    },
  },
});

eventSchema.index({ user: 1, url: 1 }, { unique: true });

export const EventModel = model<EventDocument>("Event", eventSchema);
