import React, { useEffect, useState } from "react";
import { Route, Navigate, useNavigate, RouteProps, Outlet, useLocation } from "react-router-dom";
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
  const token = JSON.parse(localStorage.getItem("access_token") as string);
  const navigate = useNavigate();

  useEffect(() => {
    getUserByToken(token)
      .then((res) => {
        if (res.data.success === false) {
          signout();
          navigate("/landing");
        } else {
          console.log("getUserById: %o", res);
          setUser(res.data);
        }
      })
      .catch(() => {
        // TODO: Add SnackBar
        //toast.error(err);
      });
  }, [navigate, token]);

  console.log("privateRoute: %o", user);
  let location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to={"/landing"} state={{ from: location }} />;
  }
  return children;
};

export default PrivateRoute;
