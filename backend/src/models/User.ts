
import mongoose from 'mongoose';
import type { Document } from 'mongoose';
const { Schema, model, models } = mongoose;
import { User } from "common/src/types";

export interface UserDocument extends Document, User {
  google_picture_url?: string;
  use_gravatar?: boolean;
  push_calendars: string[];
}


export interface GoogleTokens extends Document {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  expiry_date?: number;
}

interface GoogleTokensDocument extends GoogleTokens, Document {
}



// User schema for the Database
const tokenSchema = new Schema<GoogleTokensDocument>({
  access_token: {
    type: String,
    default: null,
  },
  refresh_token: {
    type: String,
    default: null,
  },
  scope: {
    type: String,
    default: null,
  },
  expiry_date: {
    type: Number,
    default: null,
  },
});

const calDavAccountSchema = new Schema({
  serverUrl: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: false },
  name: { type: String, required: true },
  email: { type: String, required: false }
});

// User schema for the Database
const userSchema = new Schema<UserDocument>(
  {
    _id: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: false,
      lowercase: true,
    },
    google_tokens: {
      type: tokenSchema
    },
    caldav_accounts: {
      type: [calDavAccountSchema],
      default: []
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    user_url: {
      type: String,
      default: "",
      unique: true,
    },
    picture_url: {
      type: String,
      default: "",
      unique: true,
    },
    pull_calendars: {
      type: [String],
      default: []
    },
    push_calendars: {
      type: [String],
      default: []
    },
    send_invitation_email: {
      type: Boolean,
      default: false
    },
    use_gravatar: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

export const UserModel = models.User || model<UserDocument>("User", userSchema);
