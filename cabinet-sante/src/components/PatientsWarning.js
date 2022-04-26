import "../styles/styles.css";
import { usePatients } from "./contexts/PatientsContext";
import Balance from "./Balance";
import { Table } from "@mantine/core";
import { useRef } from "react";

export default function PatientsWarning() {
  const patients = usePatients().patients;
  const count = useRef(0);

  return (
    <div>
      <h2>Forfaits à renouveler</h2>
      <div className="home-content">
        <Table striped verticalSpacing="xs">
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
                count={count}
              />
            ))}
            {count.current === 0 && (
              <tr>
                <td style={{ textAlign: "center" }} colSpan={2}>
                  Aucun patient
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
