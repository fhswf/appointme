import React, { useEffect, useState } from "react";
import { Route, Redirect, useHistory, RouteProps } from "react-router-dom";
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

const PrivateRoute = <P,>(p: PrivateRouteProps<P>) => {
  const [user, setUser] = useState<UserDocument>();
  const token = JSON.parse(localStorage.getItem("access_token") as string);
  const history = useHistory();

  useEffect(() => {
    getUserByToken(token)
      .then((res) => {
        if (res.data.success === false) {
          signout();
          history.push("/landing");
        } else {
          console.log("getUserById: %o", res);
          setUser(res.data);
        }
      })
      .catch(() => {
        // TODO: Add SnackBar
        //toast.error(err);
      });
  }, [history, token]);

  console.log("privateRoute: %o", user);
  let Component = p.component;
  return (
    <UserContext.Provider value={{ user: user }}>
      <Route
        {...p}
        render={(props: any) =>
          isAuthenticated() ? (
            user ? (
              <Component {...props} />
            ) : (
              <span>Waiting to get User</span>
            )
          ) : (
            <Redirect
              to={{
                pathname: "/landing",
                state: { from: p.location },
              }}
            />
          )
        }
      />
    </UserContext.Provider>
  );
};

export default PrivateRoute;
