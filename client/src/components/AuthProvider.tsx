import React, { useEffect, useState, useContext } from "react";
import { getUser } from "../helpers/services/user_services";
import { UserDocument } from "../helpers/UserDocument";

interface AuthContextType {
    user: UserDocument | null;
    isAuthenticated: boolean | undefined;
}

export const AuthContext = React.createContext<AuthContextType>({
    user: null,
    isAuthenticated: undefined,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserDocument | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        getUser()
            .then((res) => {
                if (res.data.success === false || res.status === 401) {
                    console.log("AuthProvider: not authenticated");
                    setIsAuthenticated(false);
                    setUser(null);
                } else {
                    console.log("AuthProvider: authenticated user %o", res.data);
                    setIsAuthenticated(true);
                    setUser(res.data);
                }
            })
            .catch((res) => {
                console.log("AuthProvider: error: %d", res.status);
                setIsAuthenticated(false);
                setUser(null);
            });
    }, []);

    const value = React.useMemo(() => ({ user, isAuthenticated }), [user, isAuthenticated]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
