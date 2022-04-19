import "../../styles/styles.css";
import { useConfig } from "../contexts/ConfigContext";
import Appointments from "./Appointments";

export default function Parameters() {
  const config = useConfig();

  return (
    <div>
      <h2>Paramètres</h2>

      <div className="main-content">
        <div className="parameters-content">
          <Appointments appointmentTypes={config.appointmentTypes} />
        </div>
      </div>
    </div>
  );
}
