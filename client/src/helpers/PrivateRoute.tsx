import React, { Component, useEffect, useMemo, useState } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { isAuthenticated, signout } from "./helpers";
import { getUserByToken } from "./services/user_services";
import { User } from "@fhswf/bookme-common";
import { UserDocument } from "./UserDocument";

/**
 * Context containing the currently logged in user
 */
export const UserContext = React.createContext<{ user: UserDocument | null }>({
  user: null,
});

type PrivateRouteProps = {
  path: string;
  exact?: boolean;
  component?: (props: any) => JSX.Element;
  children?: JSX.Element;
};

const PrivateRoute = (p: PrivateRouteProps) => {
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

  const getChildren = (props: any, childProps: any) => {
    console.log("getChild: %o %o %o", props, props.component, props.children);
    if (props.children) {
      return props.children;
    } else {
      return <p.component {...childProps} />;
    }
  };

  return (
    <Route
      path={p.path}
      exact={p.exact}
      render={(props) =>
        isAuthenticated() ? (
          user ? (
            <UserContext.Provider value={{ user: user }}>
              {getChildren(p, props)}
            </UserContext.Provider>
          ) : (
            <span>Waiting to get User</span>
          )
        ) : (
          <Redirect
            to={{
              pathname: "/landing",
              state: { from: props.location },
            }}
          />
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
