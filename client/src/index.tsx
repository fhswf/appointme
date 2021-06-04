import React, { Suspense } from "react";
import ReactDOM from "react-dom";

//import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import App from "./pages/App";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import AddEvent from "./pages/AddEvent";
import Planning from "./pages/Planning";
import Schedule from "./pages/Schedule";
import NotFound from "./pages/NotFound";
import Booking from "./pages/Booking";
import EditEvent from "./pages/EditEvent";
import PrivateRoute from "./components/PrivateRoute";
import Calendarintegration from "./pages/CalendarInt";
import Finished, { FinishedProps } from "./pages/Finished";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import { isAuthenticated } from "./helpers/helpers";
import { createTheme, ThemeProvider } from "@material-ui/core";

import "./i18n";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "100%",
        },
      },
    },
    /*
    MuiPickersDay: {
      styleOverrides: {
        root: {
          borderRadius: "50%",
        },
      },
    },*/
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: "h3",
          h2: "h4",
          h3: "h5",
          h4: "h5",
          h5: "h6",
          h6: "h6",
        },
      },
    },
  },
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    //fontSize: 12,
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback="loading">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <BrowserRouter basename={process.env.REACT_APP_URL}>
            <Switch>
              <Route exact path="/">
                {isAuthenticated() ? (
                  <Redirect to="/app" />
                ) : (
                  <Redirect to="/landing" />
                )}
              </Route>

              <PrivateRoute path="/app" exact component={App} />
              <PrivateRoute path="/addevent" exact component={AddEvent} />
              <PrivateRoute path="/editevent/:id" exact component={EditEvent} />
              <PrivateRoute
                path="/integration"
                component={Calendarintegration}
              />

              <Route
                path="/booked"
                exact
                render={(props: FinishedProps) => <Finished {...props} />}
              />

              <Route
                path="/login"
                exact
                render={(props) => <Login {...props} />}
              />
              <Route
                path="/landing"
                exact
                render={(props) => <Landing {...props} />}
              />
              <Route
                path="/schedule/:user_url/:url"
                exact
                render={(props) => <Schedule {...props} />}
              />
              <Route
                path="/users/:user_url"
                exact
                render={(props) => <Planning {...props} />}
              />
              <Route
                path="/users/:user_url/:url"
                exact
                render={(props) => <Booking {...props} />}
              />
              <Route path="*" component={NotFound} />
              <Route path="/notfound" component={NotFound} />
            </Switch>
          </BrowserRouter>
        </ThemeProvider>
      </LocalizationProvider>
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);
