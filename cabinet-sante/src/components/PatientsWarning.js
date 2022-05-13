import "../styles/styles.css";
import { usePatients } from "./contexts/PatientsContext";
import Balance from "./Balance";
import { Table } from "@mantine/core";
import {
  insertPackageIntoArray,
  calculateBalance,
  getUniqueSharedPatients,
} from "./Functions";

export default function PatientsWarning() {
  // data from context
  const patients = usePatients().patients;
  const payements = usePatients().payements;
  const appointments = usePatients().appointments;
  const sharedBalance = usePatients().sharedBalance;

  // used to exclude future appointments into balance calculation
  const today = new Date();

  function BalanceByPatient(patientId) {
    const sharedPatients = getUniqueSharedPatients(sharedBalance, patientId);
    const FilteredAppointments = appointments.filter(
      (e) => sharedPatients.findIndex((f) => f === e.patientId) !== -1
    );
    const FilteredPayements = payements.filter(
      (e) => sharedPatients.findIndex((f) => f === e.patientId) !== -1
    );
    const packagesData = FilteredPayements.filter((e) => e.eventId === 0).map(
      (obj) => ({
        ...obj,
        dataType: "package",
      })
    );

    var data = FilteredAppointments.map((obj) => ({
      ...obj,
      dataType: "event",
    }));

    packagesData.forEach((e) => insertPackageIntoArray(data, e));

    calculateBalance(data, payements);

    const balanceAsOfToday = data.filter(
      (element) =>
        new Date(element?.date) <= today || new Date(element?.start) <= today
    )[0]?.balance;

    if (balanceAsOfToday) {
      return balanceAsOfToday;
    } else {
      return 0;
    }
  }

  var NoPatientToDisplay = true;
  for (const patient of patients) {
    if (BalanceByPatient(patient?.id) < 0) {
      NoPatientToDisplay = false;
    }
  }

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
            {NoPatientToDisplay && (
              <tr>
                <td colSpan={2} style={{ textAlign: "center" }}>
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
