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
import OidcCallback from "./pages/OidcCallback";

import { useAuthenticated } from "./helpers/helpers";

import "./i18n";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from "sonner";
import "./index.css";

const CLIENT_ID = import.meta.env.REACT_APP_CLIENT_ID;
const BASE_PATH = import.meta.env.REACT_APP_BASE_PATH || "/";

console.log("base url: %s %s", BASE_PATH, import.meta.env.REACT_APP_API_URL, CLIENT_ID);

const Main = () => {
  const isAuthenticated = useAuthenticated();
  return (<StrictMode>
    <Suspense fallback="loading">
      <GoogleOAuthProvider clientId={CLIENT_ID}>
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
              path="/oidc-callback"
              element={<OidcCallback />}
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
          <Toaster />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Suspense>
  </StrictMode >
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Main />);
