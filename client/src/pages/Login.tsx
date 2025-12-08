import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { toast } from "sonner";
import { postGoogleLogin } from "../helpers/services/auth_services";

const Login = (props: any) => {
  const navigate = useNavigate();

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

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
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
    </div>
  );
};

export default Login;
