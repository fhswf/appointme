import React, { useEffect, useState, useContext, useCallback } from "react";
import { getUser } from "../helpers/services/user_services";
import { UserDocument } from "../helpers/UserDocument";

interface AuthContextType {
    user: UserDocument | null;
    isAuthenticated: boolean | undefined;
    refreshAuth: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>({
    user: null,
    isAuthenticated: undefined,
    refreshAuth: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserDocument | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);


    const refreshAuth = useCallback(async () => {
        try {
            const res = await getUser();
            console.log("AuthProvider: getUser response status=%d data=%o", res.status, res.data);

            if (res.data?.success === false || res.status === 401) {
                console.log("AuthProvider: not authenticated (logic/401)");
                setIsAuthenticated(false);
                setUser(null);
            } else if (res.data) {
                console.log("AuthProvider: authenticated user %o", res.data);
                setIsAuthenticated(true);
                setUser(res.data);
            } else {
                console.log("AuthProvider: response 200 OK but no user data found (null/empty)");
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error: any) {
            // Axios wraps the response in error.response for HTTP errors
            const status = error.response?.status || error.status;
            console.log("AuthProvider: error: %d, full error: %o", status, error);
            setIsAuthenticated(false);
            setUser(null);
        }
    }, []);




    useEffect(() => {
        refreshAuth();
    }, [refreshAuth]);

    const value = React.useMemo(() => ({ user, isAuthenticated, refreshAuth }), [user, isAuthenticated, refreshAuth]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
