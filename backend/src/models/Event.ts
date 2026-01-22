import mongoose from 'mongoose';
import type { Document } from 'mongoose';
const { Schema, model, models } = mongoose;
import { Event, DEFAULT_AVAILABILITY } from 'common'




export interface EventDocument extends Omit<Event, '_id'>, Document {
  allowed_roles?: string[];
}

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
    default: "Online",
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

  allowed_roles: {
    type: [String],
    default: [],
  },

  gender: {
    type: String,
    enum: ['male', 'female', 'neuter'],
    required: false
  },

  isActive: {
    type: Boolean,
    default: false,
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

  available: DEFAULT_AVAILABILITY,

  minFuture: {
    type: Number,
    default: 2 * 86400,
  },
  maxFuture: {
    type: Number,
    default: 60 * 86400,
  },
  maxPerDay: {
    type: Number,
    default: 2,
  },
  availabilityMode: {
    type: String,
    enum: ['define', 'default', 'extend', 'restrict'],
    default: 'define',
  },

  tags: {
    type: [String],
    default: [],
  },

  recurrence: {
    enabled: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'triweekly', 'monthly'],
      default: 'biweekly',
    },
    interval: {
      type: Number,
      default: 2,
    },
    count: {
      type: Number,
    },
    until: {
      type: String,  // ISO date string
    }
  },

});

eventSchema.index({ user: 1, url: 1 }, { unique: true });

export const EventModel = models.Event || model<EventDocument>("Event", eventSchema);
