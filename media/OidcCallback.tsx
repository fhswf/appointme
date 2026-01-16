import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { postOidcLogin } from "../helpers/services/auth_services";
import { useTranslation } from "react-i18next";
import { useAuth } from "../components/AuthProvider";

const OidcCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const processedRef = useRef(false);
    const { t } = useTranslation();
    const { refreshAuth } = useAuth();

    useEffect(() => {
        if (processedRef.current) return;
        processedRef.current = true;

        const code = searchParams.get("code");
        if (!code) {
            toast.error("No authorization code found");
            navigate("/login");
            return;
        }

        toast.promise(
            postOidcLogin(code).then(async (res) => {
                console.log("OIDC Login Success", res);
                // Small delay to ensure cookie is set before refreshing auth
                await new Promise(resolve => setTimeout(resolve, 100));
                // Refresh auth state before navigating to ensure PrivateRoute sees authenticated user
                await refreshAuth();
                navigate("/");
                return res;
            }),
            {
                loading: 'Authenticating...',
                success: () => t("login_successful"),
                error: (err: any) => {
                    console.error("OIDC Login Error", err);
                    setTimeout(() => navigate("/login"), 2000);
                    return t("login_failed") + ": " + (err.response?.data?.error || err.message);
                }
            }
        );

    }, [searchParams, navigate, refreshAuth, t]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <p>Authenticating...</p>
        </div>
    );
};

export default OidcCallback;
