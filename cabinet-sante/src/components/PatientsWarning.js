import "../styles/styles.css";
import { usePatients } from "./contexts/PatientsContext";
import Balance from "./Balance";
import { Table } from "@mantine/core";

export default function PatientsWarning() {
  const patients = usePatients().patients;

  return (
    <div>
      <h2>Forfaits à renouveler</h2>
      <div className="home-content">
        <Table
          id="myTable"
          striped
          verticalSpacing="xs"
          onChange={(event) => console.log(event)}
        >
          <thead>
            <tr>
              <th>Patient</th>
              <th>Solde</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((element) => (
              <Balance
                key={"solde" + element.id}
                patientId={element.id}
                fullDisplay={false}
                warningDisplay={true}
              />
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
