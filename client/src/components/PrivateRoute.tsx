import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, RouteProps, useLocation } from "react-router-dom";
import { getUser } from "../helpers/services/user_services";
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
  const navigate = useNavigate();

  useEffect(() => {
    getUser()
      .then((res) => {
        if (res.data.success === false || res.status === 401) {
          console.log("getUser: not authenticated");
          setAuthenticated(false);
          navigate("/landing");
        } else {
          console.log("getUser: %o", res);
          setAuthenticated(true);
          setUser(res.data);
          console.log("user set to %o", res.data);
        }
      })
      .catch(() => {
        console.log("getUserById: error");
        setAuthenticated(false);
        navigate("/landing");
        // TODO: Add SnackBar
        //toast.error(err);
      });
  }, []);

  const location = useLocation();
  const userContextValue = React.useMemo(() => ({ user }), [user]);

  if (authenticated === undefined) {
    console.log("PrivateRoute: authenticated is undefined");
    return null;
  } else if (!authenticated) {
    console.log("PrivateRoute: not authenticated, redirecting to /landing");
    return <Navigate to={"/landing"} state={{ from: location }} />;
  }
  return <UserContext.Provider value={userContextValue}>{children}</UserContext.Provider>;
};

export default PrivateRoute;
