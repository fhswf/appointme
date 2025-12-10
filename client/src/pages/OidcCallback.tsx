import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { postOidcLogin } from "../helpers/services/auth_services";

const OidcCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const processedRef = useRef(false);

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
                return "Successfully logged in";
            },
            error: (err: any) => {
                console.error("OIDC Login Error", err);
                setTimeout(() => navigate("/login"), 2000);
                return "Login failed: " + (err.response?.data?.error || err.message);
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
