import { isAuthenticated, authenticate } from "../helpers/helpers";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin, useGoogleOneTapLogin, GoogleLogin } from '@react-oauth/google';
import { postGoogleLogin } from "../helpers/services/auth_services";
import { Button, Container, SvgIcon } from "@mui/material";





const GoogleIcon = (props) => {
  return (
    <SvgIcon {...props} viewBox={"0 0 48 48"}>
      <defs>
        <path
          id="a"
          d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
        />
      </defs>
      <clipPath id="b">
        <use xlinkHref="#a" overflow="visible" />
      </clipPath>
      <path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
      <path
        clipPath="url(#b)"
        fill="#EA4335"
        d="M0 11l17 13 7-6.1L48 14V0H0z"
      />
      <path
        clipPath="url(#b)"
        fill="#34A853"
        d="M0 37l30-23 7.9 1L48 0v48H0z"
      />
      <path clipPath="url(#b)" fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
    </SvgIcon>
  )
}

const Login = (props: any) => {
  const navigate = useNavigate();

  const sendGoogleToken = (credential) => {
    console.log("postGoogleLogin: code=%s", credential)
    postGoogleLogin(credential)
      .then((res) => {
        console.log("postGoogleLogin: %o", res);
        authenticate(res, () => {
          if (isAuthenticated()) {
            navigate("/app");
          }
        });
      })
      .catch((error) => {
        console.log("GOOGLE SIGNIN ERROR", error.response);
      });
  };

  const responseGoogle = (response) => {
    sendGoogleToken(response.tokenId);
  };

  const errorResponseGoogle = (err) => {
    console.error("google login error: %j", err);
    //TODO: Add Snackbar and Alert
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
