import React from "react";
import ReactDOM from "react-dom";

//import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import App from "./pages/App";
import Register from "./pages/Register";
import Activate from "./pages/Activate";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import AddEvent from "./pages/AddEvent";
import Planning from "./pages/Planning";
import NotFound from "./pages/NotFound";
import Booking from "./pages/Booking";
import EditEvent from "./pages/EditEvent";
import PrivateRoute from "./helpers/PrivateRoute";
import Calendarintegration from "./pages/CalendarInt";
import Bookdetails from "./pages/BookDetails";
import Finished, { FinishedProps } from "./pages/Finished";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";

ReactDOM.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <BrowserRouter basename="/bookme">
        <Switch>
          <PrivateRoute path="/app" exact>
            <App />
          </PrivateRoute>
          <PrivateRoute path="/addevent" exact component={AddEvent} />
          <PrivateRoute path="/editevent/:id" exact component={EditEvent} />

          <PrivateRoute path="/integration" component={Calendarintegration} />
          <Route
            path="/users/:user_url/:url/:date"
            exact
            render={(props) => <Bookdetails {...props} />}
          />
          <Route
            path="/booked"
            exact
            render={(props: FinishedProps) => <Finished {...props} />}
          />

          <Route
            path="/register"
            exact
            render={(props) => <Register {...props} />}
          />
          <Route path="/login" exact render={(props) => <Login {...props} />} />
          <Route
            path="/landing"
            exact
            render={(props) => <Landing {...props} />}
          />
          <Route
            path="/activate/:token"
            exact
            render={(props) => <Activate {...props} />}
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
    </LocalizationProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
