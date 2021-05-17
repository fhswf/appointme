import React from "react";

import "../styles/landing.css";

import { isAuthenticated } from "../helpers/helpers";
import { Link, Redirect } from "react-router-dom";

import AppNavbar from "../components/AppNavbar";
import Paper from "@material-ui/core/Paper";

const Landing = (props: any) => {
  return (
    <div className="landing">
      {isAuthenticated() ? <Redirect to="/app" /> : null}
      <AppNavbar />
      <Paper>
        <div className="section">
          <div className="subsection">
            <div className="container">
              <h1 className="sectionheader">How Bookme works</h1>
              <div className="steps">
                <div className="row">
                  <div className="stepone">
                    <div className="step-description">
                      <p>
                        <strong>Create Events</strong>
                      </p>

                      <p>
                        Create events. Setup your available times and you're
                        good to go!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="steptwo">
                    <div className="step-description">
                      <p>
                        <strong>Share your Link</strong>
                      </p>

                      <p>Users can use this link to book appointments.</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="stepthree">
                    <div className="step-description">
                      <p>
                        <strong>Done! Congrats!</strong>
                      </p>

                      <p>
                        Once a user books a appointment, the event is added to
                        your Calendar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default Landing;
