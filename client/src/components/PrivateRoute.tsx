import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, RouteProps, useLocation } from "react-router-dom";
import { isAuthenticated, signout } from "../helpers/helpers";
import { getUserByToken } from "../helpers/services/user_services";
import { UserDocument } from "../helpers/UserDocument";

/**
 * Context containing the currently logged in user
 */
export const UserContext = React.createContext<{ user: UserDocument | null }>({
  user: null,
});

export type PrivateRouteProps<P> = RouteProps & {
  component: React.FunctionComponent<P>;
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<UserDocument>();
  const [authenticated, setAuthenticated] = useState(undefined);
  const token = JSON.parse(localStorage.getItem("access_token") as string);
  const navigate = useNavigate();

  useEffect(() => {
    getUserByToken(token)
      .then((res) => {
        if (res.data.success === false || res.status === 401) {
          signout();
          navigate("/landing");
        } else {
          console.log("getUserByToken: %o", res);
          setUser(res.data);
          console.log("user set to %o", res.data);
        }
      })
      .catch(() => {
        console.log("getUserById: error");
        // TODO: Add SnackBar
        //toast.error(err);
      });
  }, [token]);

  useEffect(() => {
    console.log("Checking if authenticated");
    setAuthenticated(isAuthenticated());
  }, [user]);

  let location = useLocation();

  if (authenticated === undefined) {
    console.log("PrivateRoute: authenticated is undefined");
    return null;
  } else if (!authenticated) {
    console.log("PrivateRoute: not authenticated, redirecting to /landing");
    return <Navigate to={"/landing"} state={{ from: location }} />;
  }
  console.log("PrivateRoute: authenticated, rendering children");
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

export default PrivateRoute;
