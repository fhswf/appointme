import { useState, useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import EventList from "../components/EventList";
import AppNavbar from "../components/AppNavbar";
import { UserContext } from "../components/PrivateRoute";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Toaster } from "sonner";

const App = () => {
  const user = useContext(UserContext).user;
  const [connected, setConnected] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setConnected(!!user);
  }, [user]);

  const addEventButton = () => {
    if (connected) {
      return (
        <Button asChild className="rounded-full" data-testid="add-event-button">
          <RouterLink to="/addevent">
            <Plus className="mr-2 h-4 w-4" />
            {t("early_sweet_mantis_peek")}
          </RouterLink>
        </Button>
      );
    } else {
      return (
        <Button asChild variant="link" className="calcon">
          <RouterLink to="/integration">
            {t("pink_trite_ocelot_enrich")}
          </RouterLink>
        </Button>
      );
    }
  };

  const renderList = () => {
    if (user && connected) {
      return <EventList url={user.user_url} />;
    }
  };

  console.log("App: user=%o", user);
  return (
    <>
      <AppNavbar />
      <div className="container mx-auto p-4">
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-4">
            {t("low_clean_haddock_bubble")}
          </h1>
          <div className="flex justify-between items-center">
            {user ? (
              <>
                <div>
                  <h2 className="text-xl font-semibold">
                    {user.name}
                  </h2>
                  <br />
                  <Button asChild variant="link" className="p-0 h-auto">
                    <RouterLink to={"/users/" + user.user_url}>
                      {user.user_url}
                    </RouterLink>
                  </Button>
                </div>
                <div>{addEventButton()}</div>
              </>
            ) : (
              <span>{t("deft_suave_bear_pause")}</span>
            )}
          </div>
        </div>

        {renderList()}
      </div>
      <Toaster />
    </>
  );
};

export default App;
