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
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h3 className="mb-10 text-3xl font-bold text-gray-900">
          {t("pink_loose_cougar_grin")}
        </h3>

        <CalendarSettings />

        <div className="mt-10 flex justify-end">
          <Button onClick={() => navigate("/")} data-testid="close-button">
            {t("Close")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Calendarintegration;
