
import { Document, Schema, model } from 'mongoose';
import { genSalt, hash } from "bcryptjs";

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
  push_calendar?: string;
  pull_calendars?: string[];
}

interface GoogleTokensDocument extends GoogleTokens, Document {
}

interface UserDocument extends User, Document {
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
    name: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
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
    welcome: {
      type: String,
      default: "Willkommen auf meiner Planungsseite",
    },
    pull_calendars: {
      type: Array,
      default: null
    },
    push_calendar: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {

  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  // generate a salt
  genSalt(10)
    .then((salt: string) =>    // hash the password using our new salt
      hash(this.password, salt)
        .then((hsh: string) => { this.password = hsh; next(); })
        .catch(next)
    )
    .catch(next);

});

export const UserModel = model<UserDocument>("User", userSchema);
