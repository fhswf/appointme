import React from "react";

/*
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
*/

import { Redirect, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { isAuthenticated } from "../helpers/helpers";
import { postToActivate } from "../helpers/services/auth_services";
import { Button } from "@material-ui/core";

/*------------Font Awesome Icons --------------*/

const Activate = ({ match }) => {
  const handleOnSubmit = (e) => {
    e.preventDefault();
    postToActivate(match.params.token)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.errors);
      });
  };

  return (
    <div className="activate">
      <ToastContainer autoClose={2500} />
      <div className="activate-container">
        <h3> Welcome to Bookme</h3>
        <div className="activatebox">
          <form onSubmit={handleOnSubmit}>
            <Button variant="contained" type="submit">
              Activate your Account
            </Button>
            <p>Already got an Account?</p>
            <Button
              variant="contained"
              href="/login"
              role="button"
              target="_self"
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Activate;
