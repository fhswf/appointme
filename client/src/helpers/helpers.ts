import { use } from "i18next";
import { UserContext } from "../components/PrivateRoute";
import { useContext, useEffect, useState } from "react";
import { getUser } from "./services/user_services";
import { set } from "date-fns";

export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};


export const signout = () => {
  console.log('signout');
  removeLocalStorage("access_token");
};


export function useAuthenticated() {
  const userContext = useContext(UserContext);

  return userContext.user !== null
};
