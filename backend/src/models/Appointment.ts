import mongoose from 'mongoose';
import type { Document } from 'mongoose';
const { Schema, model, models } = mongoose;
import { Appointment } from 'common'

export interface AppointmentDocument extends Omit<Appointment, '_id'>, Document {
    status: 'pending' | 'synced' | 'failed';
    syncError?: string;
    lastSyncAttempt?: Date;
}

const appointmentSchema = new Schema<AppointmentDocument>({
    user: {
        type: String,
        required: true,
        index: true
    },
    event: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    attendeeName: {
        type: String,
        required: true
    },
    attendeeEmail: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    googleId: {
        type: String
    },
    caldavUid: {
        type: String
    },
    seriesId: {
        type: String,
        index: true  // For querying all appointments in a series
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurrenceIndex: {
        type: Number
    },
    status: {
        type: String,
        enum: ['pending', 'synced', 'failed'],
        default: 'pending'
    },
    syncError: {
        type: String
    },
    lastSyncAttempt: {
        type: Date
    }
}, {
    timestamps: true
});

appointmentSchema.index({ user: 1, start: 1 });

export const AppointmentModel = models.Appointment || model<AppointmentDocument>("Appointment", appointmentSchema);
