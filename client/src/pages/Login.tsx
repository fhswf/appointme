import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
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
  const [oidcEnabled, setOidcEnabled] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    getAuthConfig()
      .then((res: any) => {
        setOidcEnabled(res.oidcEnabled);
        setGoogleEnabled(res.googleEnabled);
      })
      .catch(console.error);
  }, []);

  const sendGoogleToken = async (credential) => {
    console.log("postGoogleLogin: code=%s", credential)
    try {
      const res = await postGoogleLogin(credential);
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
      {googleEnabled && (
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
            sendGoogleToken(credentialResponse.credential);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
          useOneTap
        />
      )}
      {oidcEnabled && (
        <Button onClick={handleOidcLogin} variant="outline" data-testid="login-sso">
          {t("login_with_sso")}
        </Button>
      )}
    </div>
  );
};

export default Login;
