import React, { useEffect, useState, useContext, useCallback } from "react";
import { getUser } from "../helpers/services/user_services";
import { UserDocument } from "../helpers/UserDocument";

interface AuthContextType {
    user: UserDocument | null;
    isAuthenticated: boolean | undefined;
    refreshAuth: () => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: UserDocument | null) => void;
}

export const AuthContext = React.createContext<AuthContextType>({
    user: null,
    isAuthenticated: undefined,
    refreshAuth: async () => { },
    logout: async () => { },
    setUser: () => { },
});

import { signout } from "../helpers/helpers";
import * as Sentry from "@sentry/react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserDocument | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);


    const refreshAuth = useCallback(async () => {
        try {
            const res = await getUser();
            console.log("AuthProvider: getUser response status=%d data=%o", res.status, res.data);

            if (res.status === 200 && res.data && res.data.success !== false) {
                console.log("AuthProvider: authenticated user %o", res.data);
                setIsAuthenticated(true);
                setUser(res.data);
                Sentry.setUser({
                    id: res.data._id,
                    email: res.data.email,
                    username: res.data.name,
                });
            } else {
                console.log("AuthProvider: no user data found (status=%d)", res.status);
                setIsAuthenticated(false);
                setUser(null);
                Sentry.setUser(null);
            }
        } catch (error: any) {
            // Axios wraps the response in error.response for HTTP errors
            const status = error.response?.status || error.status;
            console.log("AuthProvider: error: %d, full error: %o", status, error);
            setIsAuthenticated(false);
            setUser(null);
            Sentry.setUser(null);
        }
    }, []);




    useEffect(() => {
        refreshAuth();
    }, [refreshAuth]);

    const logout = useCallback(async () => {
        await signout();
        setIsAuthenticated(false);
        setUser(null);
        Sentry.setUser(null);
    }, []);

    const value = React.useMemo(() => ({ user, isAuthenticated, refreshAuth, logout, setUser }), [user, isAuthenticated, refreshAuth, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
