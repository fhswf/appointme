import { User } from "@fhswf/bookme-common";

export interface UserDocument extends User {
  _id: string;
}
