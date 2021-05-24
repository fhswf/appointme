import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { isAuthenticated, authenticate } from "../helpers/helpers";
import { Redirect, Link, useHistory } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { postGoogleLogin, postLogin } from "../helpers/services/auth_services";
import { Button, TextField } from "@material-ui/core";

/*
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
*/

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
    <div className="login">
      {isAuthenticated() ? <Redirect to="/app" /> : null}
      <ToastContainer />
      <div className="login-container">
        <div className="calIcon" onClick={onIconClick}>
          Bookme
        </div>
        <p>Login to your Bookme account</p>
        <div className="loginbox">
          <form onSubmit={handleOnSubmit}>
            <TextField
              type="email"
              label="Email"
              placeholder="name@example.com"
              onChange={handleChangeEvent("email")}
              value={email}
            />

            <TextField
              type="password"
              label="Password"
              onChange={handleChangeEvent("password")}
              value={password}
            />

            <Button variant="contained" type="submit">
              {changeBtnTxt}
            </Button>

            <p></p>

            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_ID}
              onSuccess={responseGoogle}
              onFailure={errorResponseGoogle}
              cookiePolicy={"single_host_origin"}
              render={(renderProps) => (
                <Button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  Sign in with Google
                </Button>
              )}
            ></GoogleLogin>

            <p>No account yet?</p>

            <Button
              variant="outlined"
              component={Link}
              to="/register"
              role="button"
              target="_self"
            >
              Sign up
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
