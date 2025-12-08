import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { postGoogleLogin, getAuthConfig, getOidcAuthUrl } from "../helpers/services/auth_services";
import { useState, useEffect } from "react";

const Login = (props: any) => {
  const navigate = useNavigate();
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

  const sendGoogleToken = (credential) => {
    console.log("postGoogleLogin: code=%s", credential)
    postGoogleLogin(credential)
      .then((res) => {
        console.log("postGoogleLogin: %o", res);
        navigate("/app");
      })
      .catch((error) => {
        console.log("GOOGLE SIGNIN ERROR", error.response);
        toast.error("Google login failed: " + (error.response?.data?.message || error.message));
      });
  };

  const handleOidcLogin = () => {
    getOidcAuthUrl()
      .then((res: any) => {
        if (res.url) window.location.href = res.url;
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to start SSO login");
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
        <Button onClick={handleOidcLogin} variant="outline">
          Login with SSO
        </Button>
      )}
    </div>
  );
};

export default Login;
