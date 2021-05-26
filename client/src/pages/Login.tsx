import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { isAuthenticated, authenticate } from "../helpers/helpers";
import { Redirect, Link, useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { postGoogleLogin, postLogin } from "../helpers/services/auth_services";
import { Button, Container, SvgIcon, TextField } from "@material-ui/core";

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
  );
};
const Login = (props: any) => {
  const history = useHistory();

  const sendGoogleToken = (idToken) => {
    postGoogleLogin(idToken)
      .then((res) => {
        authenticate(res, () => {
          if (isAuthenticated()) {
            history.push("/app");
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
    console.error("google login error: %o", err);
    toast.error("Google Login failed, please try again");
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    changeBtnTxt: "Login",
  });

  const { email, password, changeBtnTxt } = formData;

  const handleChangeEvent = (text) => (event) => {
    setFormData({ ...formData, [text]: event.target.value });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (email && password) {
      setFormData({ ...formData, changeBtnTxt: "Waiting" });
      postLogin(email, password)
        .then((res) => {
          authenticate(res, () => {
            setFormData({
              ...formData,
              email: "",
              password: "",
              changeBtnTxt: "Waiting",
            });
            isAuthenticated();
            toast.success(`Hey ${res.data.user.name}, Welcome back!`);
          });
        })
        .catch((err) => {
          setFormData({
            ...formData,
            email: "",
            password: "",
            changeBtnTxt: "Sign In",
          });
          toast.error(err.response.data.errors);
        });
    } else {
      toast.error("Please fill in all fields");
    }
  };

  const onIconClick = () => {
    history.push("/landing");
  };

  return (
    <Container>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_ID}
        onSuccess={responseGoogle}
        onFailure={errorResponseGoogle}
        cookiePolicy={"single_host_origin"}
        render={(renderProps) => (
          <Button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>
        )}
      />
    </Container>
  );
};

export default Login;
