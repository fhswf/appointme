import { useLocation } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";



export type FinishedProps = {};

const Finished = (props: FinishedProps) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  console.log("state: %o", location.state);
  const time = location.state.time as Date;
  const event = location.state.event;
  const user = location.state.user;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        {t("Confirmation")}
      </h1>
      <p className="text-lg">
        <Trans i18nKey="confirmationText" context={event?.gender || 'neuter'}>
          You booked an {{ event: event?.name }} with {{ name: user.name }} appointment on{" "}
          {{
            date: time?.toLocaleDateString(i18n.language, {
              dateStyle: "short",
            }),
          }}
          at
          {{
            time: time?.toLocaleTimeString(i18n.language, {
              timeStyle: "short",
            }),
          }}
          .
        </Trans>
      </p>
    </div>
  );
};
export default Finished;
