import { Suspense, StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import Legal from "./pages/Legal";
import About from "./pages/About";
import Appointments from "./pages/Appointments";
import { AuthProvider } from "./components/AuthProvider";

import "./i18n";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from "sonner";
import "./index.css";

import { CONFIG } from "./helpers/config";

import * as Sentry from "@sentry/react";

if (CONFIG.SENTRY_DSN) {
  Sentry.init({
    release: "appointme-client@" + CONFIG.VERSION,
    environment: CONFIG.ENVIRONMENT,
    dsn: CONFIG.SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
      Sentry.feedbackIntegration({
        colorScheme: "system",
        autoInject: false,
      }),
      Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),

    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", "appointme.gawron.cloud", /^\//],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    enableTracing: true,
    enableLogs: true,
  });
}

const CLIENT_ID = CONFIG.CLIENT_ID;
const BASE_PATH = CONFIG.BASE_PATH;

console.log("base url: %s %s", BASE_PATH, CONFIG.API_URL, CLIENT_ID);

const Main = () => {

  return (<StrictMode>
    <Suspense fallback="loading">
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <AuthProvider>
          <BrowserRouter basename={BASE_PATH}>
            <Routes>
              {/* Public Routes - Global Auth Context Available */}
              <Route path="/users/:user_url" element={<Planning />} />
              <Route path="/users/:user_url/:url" element={<Booking />} />
              <Route path="/booked" element={<Finished />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/about" element={<About />} />
              <Route path="/notfound" element={<NotFound />} />

              {/* Protected Routes */}
              <Route path="/" element={
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
                path="/appointments"
                element={
                  <PrivateRoute>
                    <Appointments />
                  </PrivateRoute>
                }
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

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </GoogleOAuthProvider>
    </Suspense >
  </StrictMode >
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Main />);
