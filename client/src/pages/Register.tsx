import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Redirect, Link } from "react-router-dom";

import { isAuthenticated } from "../helpers/helpers";
import { postToRegister } from "../helpers/services/auth_services";

const Register = ({ history }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    changeBtnTxt: "Register",
  });
  const { name, email, password, password2, changeBtnTxt } = formData;

  const handleChangeEvent = (text) => (event) => {
    setFormData({ ...formData, [text]: event.target.value });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (name && email && password) {
      if (password === password2) {
        setFormData({ ...formData, changeBtnTxt: "wait" });
        postToRegister(name, email, password)
          .then((res) => {
            toast.success(res.data.message);
            setFormData({
              ...formData,
              name: "",
              email: "",
              password: "",
              password2: "",
              changeBtnTxt: "Submitted",
            });
          })
          .catch((err) => {
            setFormData({
              ...formData,
              name: "",
              email: "",
              password: "",
              password2: "",
              changeBtnTxt: "Sign Up",
            });
            toast.error(err.response.data.errors);
          });
      } else {
        toast.error("Passwords don't match");
      }
    } else {
      toast.error("Please fill in all fields");
    }
  };

  const onIconClick = () => {
    history.push("/landing");
  };

  return (
    <div className="register">
      <ToastContainer />
      {isAuthenticated() ? <Redirect to="/" /> : null}
      <div className="register-container">
        <div className="calIcon" onClick={onIconClick}>
          Bookme
        </div>
        <p>Sign up for Bookme</p>
        To be done via Auth0.
      </div>
    </div>
  );
};
export default Register;
