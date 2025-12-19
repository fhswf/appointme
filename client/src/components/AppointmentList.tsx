import AgendaView from "./AgendaView";

interface AppointmentListProps {
    userUrl?: string;
}

const AppointmentList: React.FC<AppointmentListProps> = () => {
    return <AgendaView />;
};

export default AppointmentList;
