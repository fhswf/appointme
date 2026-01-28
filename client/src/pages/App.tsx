import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import EventList from "../components/EventList";
import AppNavbar from "../components/AppNavbar";

import { UserContext } from "../components/PrivateRoute";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Tabs removed

import AppointmentList from "../components/AppointmentList";
import { useLocation } from "react-router-dom";

const App = () => {
  const user = useContext(UserContext).user;
  /*
   * The "connected" state was previously used to show a "loading" or "onboarding" view 
   * (integration link) briefly before checking if the user was connected.
   * However, since `user` is guaranteed to be non-null here (checked at line 31) and we 
   * aren't checking for specific connection status (like calendars existing) other than `!!user`,
   * this state caused a double render and double fetch of events.
   * 
   * If we need to show an onboarding view for users with no calendars, we should check:
   * if (!user.calendars || user.calendars.length === 0) { ... }
   * 
   * For now, we render the main event list immediately.
   */
  const { t } = useTranslation();
  const location = useLocation();
  const isAppointments = location.pathname === "/appointments";

  const renderContent = () => {
    if (!user) return null;

    if (user.isTransient) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
          <h1 className="text-3xl font-bold">{t("Welcome, {{name}}", { name: user.name })}</h1>
          <p className="text-muted-foreground max-w-md">
            {t("You are logged in via your Learning Management System. Please use the specific booking links provided in your course to book appointments.")}
          </p>
          <Button asChild variant="outline" className="mt-4">
            <RouterLink to="/logout">
              {t("Logout")}
            </RouterLink>
          </Button>
        </div>
      );
    }

    if (isAppointments) {
      return <AppointmentList />;
    }

    // Default: events
    return (
      <>
        <div className="mb-10 text-center sm:text-left sm:flex sm:items-end sm:justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">
              {t("low_clean_haddock_bubble")}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{user.name}</span>
              <span className="hidden sm:inline text-muted-foreground/50">•</span>
              <Button asChild variant="link" className="p-0 h-auto text-muted-foreground font-normal hover:text-primary">
                <RouterLink to={"/users/" + user.user_url}>
                  @{user.user_url}
                </RouterLink>
              </Button>
            </div>
          </div>

          <div className="mt-4 sm:mt-0">
            <Button
              asChild
              className="hidden md:inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full shadow-lg transition-transform hover:-translate-y-0.5 font-medium text-sm h-auto"
              data-testid="add-event-button-desktop"
            >
              <RouterLink to="/addevent">
                <Plus className="text-sm w-4 h-4" />
                <span>{t("Add Event Type")}</span>
              </RouterLink>
            </Button>
          </div>
        </div>
        <EventList url={user.user_url} user={user} />
      </>
    );
  };
  console.log("App: user=%o", user);
  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden relative selection:bg-gray-200 dark:selection:bg-gray-800">
      <AppNavbar />

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {renderContent()}
        </div>
      </main>

      {!!user && (
        <div className="md:hidden fixed bottom-6 left-0 right-0 flex justify-center z-40 px-6 pointer-events-none">
          <Button
            asChild
            className="pointer-events-auto bg-primary text-primary-foreground shadow-floating hover:bg-primary/90 active:scale-95 transform transition-all duration-200 rounded-full py-3 px-6 flex items-center gap-2 text-sm font-semibold h-auto"
            data-testid="add-event-button-mobile"
          >
            <RouterLink to="/addevent">
              <Plus className="text-lg w-5 h-5" />
              <span>{t("Add Event Type")}</span>
            </RouterLink>
          </Button>
        </div>
      )}
    </div>
  );
};

export default App;
