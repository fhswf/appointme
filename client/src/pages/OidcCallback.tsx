import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { postOidcLogin } from "../helpers/services/auth_services";
import { useTranslation } from "react-i18next";

const OidcCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const processedRef = useRef(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (processedRef.current) return;
        processedRef.current = true;

        const code = searchParams.get("code");
        if (!code) {
            toast.error("No authorization code found");
            navigate("/login");
            return;
        }

        toast.promise(postOidcLogin(code), {
            loading: 'Authenticating...',
            success: (res) => {
                console.log("OIDC Login Success", res);
                navigate("/");
                return t("login_successful");
            },
            error: (err: any) => {
                console.error("OIDC Login Error", err);
                setTimeout(() => navigate("/login"), 2000);
                return t("login_failed") + ": " + (err.response?.data?.error || err.message);
            }
        });

    }, [searchParams, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <p>Authenticating...</p>
        </div>
    );
};

export default OidcCallback;
