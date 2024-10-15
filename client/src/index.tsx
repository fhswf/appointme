import React, { Suspense, StrictMode } from "react";
import { createRoot } from 'react-dom/client';

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import App from "./pages/App";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import AddEvent from "./pages/AddEvent";
import Planning from "./pages/Planning";
import NotFound from "./pages/NotFound";
import Booking from "./pages/Booking";
import EditEvent from "./pages/EditEvent";
import PrivateRoute from "./components/PrivateRoute";
import Calendarintegration from "./pages/CalendarInt";
import Finished from "./pages/Finished";

import { useAuthenticated } from "./helpers/helpers";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from 'notistack';

import "./i18n";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { deDE } from '@mui/x-date-pickers/locales';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { de } from 'date-fns/locale/de';
import 'dayjs/locale/de';
import { GoogleOAuthProvider } from '@react-oauth/google';


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
}, deDE);


const CLIENT_ID = import.meta.env.REACT_APP_CLIENT_ID;
const BASE_PATH = import.meta.env.REACT_APP_BASE_PATH || "/";

console.log("base url: %s %s", BASE_PATH, import.meta.env.REACT_APP_API_URL, CLIENT_ID);
console.log("localeText: %o", deDE.components.MuiLocalizationProvider.defaultProps.localeText);



const Main = () => {
  const isAuthenticated = useAuthenticated();
  return (<StrictMode>
    <Suspense fallback="loading">
      <SnackbarProvider maxSnack={3}>
        <GoogleOAuthProvider clientId={CLIENT_ID}>

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de} localeText={deDE.components.MuiLocalizationProvider.defaultProps.localeText}>
            <ThemeProvider theme={theme}>
              <BrowserRouter basename={BASE_PATH}>
                <Routes>
                  <Route path="/" element={isAuthenticated ? (
                    <Navigate to="/app" />
                  ) : (
                    <Navigate to="/landing" />
                  )} />

                  <Route path="/app" element={
                    <PrivateRoute>
                      <App />
                    </PrivateRoute>
                  } />

                  <Route path="/addevent" element={
                    <PrivateRoute>
                      <AddEvent />
                    </PrivateRoute>
                  } />

                  <Route path="/editevent/:id" element={
                    <PrivateRoute>
                      <EditEvent />
                    </PrivateRoute>
                  } />

                  <Route
                    path="/integration/*"
                    element={
                      <PrivateRoute>
                        <Calendarintegration />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/booked"
                    element={<Finished />}
                  />

                  <Route
                    path="/login"
                    element={<Login />}
                  />
                  <Route
                    path="/landing"
                    element={<Landing />}
                  />
                  <Route
                    path="/users/:user_url"
                    element={<Planning />}
                  />
                  <Route
                    path="/users/:user_url/:url"
                    element={<Booking />}
                  />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/notfound" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ThemeProvider>
          </LocalizationProvider>

        </GoogleOAuthProvider>
      </SnackbarProvider>
    </Suspense>
  </StrictMode>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Main />);
