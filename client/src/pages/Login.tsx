import { useAuthenticated, authenticate } from "../helpers/helpers";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { postGoogleLogin } from "../helpers/services/auth_services";
import { Container } from "@mui/material";

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
      });
  };

  return (
    <Container>

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

    </Container>
  );
};

export default Login;
