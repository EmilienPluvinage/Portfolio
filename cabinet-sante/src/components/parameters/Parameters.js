import { Grid } from "@mantine/core";
import "../../styles/styles.css";
import { useConfig } from "../contexts/ConfigContext";
import Appointments from "./Appointments";
import Patients from "./Patients";

export default function Parameters() {
  const config = useConfig();

  return (
    <div>
      <h2>Paramètres</h2>

      <div className="main-content">
        <div className="parameters-content">
          <Grid>
            <Grid.Col span={3}>
              <Appointments appointmentTypes={config.appointmentTypes} />
            </Grid.Col>
            <Grid.Col span={3}>
              <Patients patientTypes={config.patientTypes} />
            </Grid.Col>
          </Grid>
        </div>
      </div>
    </div>
  );
}
