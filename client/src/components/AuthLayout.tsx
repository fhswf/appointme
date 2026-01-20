import { Outlet } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";

export const AuthLayout = () => {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
};
