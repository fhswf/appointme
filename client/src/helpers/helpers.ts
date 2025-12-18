
import { UserContext } from "../components/PrivateRoute";
import { useContext } from "react";
import { postLogout } from "./services/auth_services";

export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};




export const signout = async () => {
  console.log('signout');
  try {
    await postLogout();
  } catch (error) {
    console.error("Logout failed", error);
  }
};


export function useAuthenticated() {
  const userContext = useContext(UserContext);

  return userContext.user !== null
};
