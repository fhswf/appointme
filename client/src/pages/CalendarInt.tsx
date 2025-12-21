import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { CalendarSettings } from "../components/CalendarSettings";

const Calendarintegration = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <AppNavbar />
      <div className="container mx-auto p-4">
        <h3 className="text-3xl font-bold mb-4">
          {t("pink_loose_cougar_grin")}
        </h3>

        <CalendarSettings />

        <div className="p-4 flex justify-end">
          <Button onClick={() => navigate("/")} data-testid="close-button">
            {t("Close")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Calendarintegration;
