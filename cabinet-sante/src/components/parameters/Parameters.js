import { Grid } from "@mantine/core";
import "../../styles/styles.css";
import { useConfig } from "../contexts/ConfigContext";
import Appointments from "./Appointments";
import Patients from "./Patients";
import Packages from "./Packages";
import PriceScheme from "./PriceScheme";
import PayementMethods from "./PayementMethods";
import Calendar from "./Calendar";

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
            <Grid.Col span={3}>
              <Packages packages={config.packages} />
            </Grid.Col>
            <Grid.Col span={3}>
              <PayementMethods parameters={config.parameters} />
            </Grid.Col>
          </Grid>
          <Calendar />
          <PriceScheme />
        </div>
      </div>
    </div>
  );
}
