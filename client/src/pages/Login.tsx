import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { postGoogleLogin, getAuthConfig, getOidcAuthUrl } from "../helpers/services/auth_services";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../components/AuthProvider";

const Login = (props: any) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { refreshAuth } = useAuth();
  const [config, setConfig] = useState<any>({});

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => { sendGoogleToken(codeResponse.code) },
    onError: (error) => console.log('Login Failed:', error),
    flow: 'auth-code',
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res: any = await getAuthConfig();
        setConfig(res);
      } catch (e) {
        console.error(e);
      }
    };
    fetchConfig();
  }, []);

  const sendGoogleToken = async (code) => {
    console.log("postGoogleLogin: code=%s", code)
    try {
      const res = await postGoogleLogin(code);
      console.log("postGoogleLogin: %o", res);
      // Refresh auth state before navigating to ensure PrivateRoute sees authenticated user
      await refreshAuth();
      navigate("/");
    } catch (error: any) {
      console.log("GOOGLE SIGNIN ERROR", error.response);
      toast.error(t("google_login_failed") + ": " + (error.response?.data?.message || error.message));
    }
  };

  const handleOidcLogin = () => {
    getOidcAuthUrl()
      .then((res: any) => {
        if (res.url) globalThis.location.href = res.url;
      })
      .catch((err) => {
        console.error(err);
        toast.error(t("login_failed"));
      });
  }

  return (
    <div className="container mx-auto p-4 flex flex-col justify-center items-center min-h-screen gap-4">
      {config.oidcEnabled && (
        <Button onClick={handleOidcLogin} variant="outline" className="w-64 justify-start pl-4" data-testid="login-sso">
          {config.oidcIcon && (
            <img src={config.oidcIcon} alt="SSO Icon" className="mr-2 h-4 w-4" />
          )}
          {t("login_with")} {t(config.oidcName || "SSO")}
        </Button>
      )}
      {config.googleEnabled && (
        <Button onClick={() => loginWithGoogle()} variant="outline" className="w-64 justify-start pl-4" data-testid="login-google">
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          {t("login_with")} Google
        </Button>
      )}
    </div>
  );
};

export default Login;
