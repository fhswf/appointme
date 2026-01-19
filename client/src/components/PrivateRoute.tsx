
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { UserDocument } from "../helpers/UserDocument";

/**
 * Context containing the currently logged in user
 * Keeping this for backward compatibility
 */
export const UserContext = React.createContext<{ user: UserDocument | null }>({
  user: null,
});

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Let's forward the user to the old UserContext provider to minimize refactoring elsewhere.
  const userContextValue = React.useMemo(() => ({ user }), [user]);

  if (isAuthenticated === undefined) {
    return null; // Or a loading spinner
  } else if (!isAuthenticated || (user && !user._id)) {
    console.log("PrivateRoute: not authenticated or transient user, redirecting to /landing");
    return <Navigate to={"/landing"} state={{ from: location }} />;
  }

  // We can still provide the UserContext here for children that might be consuming it directly
  // from this file's export, but better to rely on AuthProvider's context if possible.
  // However, since we kept UserContext export, let's provider it to be safe for now,
  // matching the old behavior where PrivateRoute provided it.
  // Although AuthProvider also provides it, nesting providers is fine or we can just forward it.
  // Actually, wait. AuthProvider provides AuthContext, not UserContext.
  // The old code had: export const UserContext = React.createContext
  // So existing components likely import UserContext from "./PrivateRoute".

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default PrivateRoute;

