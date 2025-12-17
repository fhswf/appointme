import { useState, useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import EventList from "../components/EventList";
import AppNavbar from "../components/AppNavbar";

import { UserContext } from "../components/PrivateRoute";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const App = () => {
  const user = useContext(UserContext).user;
  const [connected, setConnected] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setConnected(!!user);
  }, [user]);



  const renderList = () => {
    if (user && connected) {
      return <EventList url={user.user_url} user={user} />;
    }
  };

  console.log("App: user=%o", user);
  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden relative selection:bg-gray-200 dark:selection:bg-gray-800">
      <AppNavbar />

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-10 text-center sm:text-left sm:flex sm:items-end sm:justify-between border-b border-border pb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">
                {t("low_clean_haddock_bubble")}
              </h1>
              {user && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{user.name}</span>
                  <span className="hidden sm:inline text-muted-foreground/50">•</span>
                  <Button asChild variant="link" className="p-0 h-auto text-muted-foreground font-normal hover:text-primary">
                    <RouterLink to={"/users/" + user.user_url}>
                      @{user.user_url}
                    </RouterLink>
                  </Button>
                </div>
              )}
              {!user && (
                <div className="text-muted-foreground mt-2">
                  <p>{t("deft_suave_bear_pause")}</p>
                </div>
              )}
            </div>

            <div className="mt-4 sm:mt-0">
              {connected && (
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
              )}
            </div>
          </div>
          {user && !connected && (
            <div className="mt-2 mb-8">
              <Button asChild variant="link" className="p-0 h-auto text-sm">
                <RouterLink to="/integration">
                  {t("pink_trite_ocelot_enrich")}
                </RouterLink>
              </Button>
            </div>
          )}

          {renderList()}
        </div>
      </main>

      {connected && (
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
