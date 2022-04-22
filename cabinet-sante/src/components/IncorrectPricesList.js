import "../styles/styles.css";
import { usePatients } from "./contexts/PatientsContext";
import { Table } from "@mantine/core";
import { displayDate, displayTime } from "./Functions";
import { useConfig } from "./contexts/ConfigContext";

import UpdatePrice from "./UpdatePrice";
import ConfirmPrice from "./ConfirmPrice";

export default function IncorrectPricesList() {
  // This component is going to display potential incorrect prices for the user to confirm, we the possibility to update them one by one, or to confirm them all in one go.
  const appointmentTypes = useConfig().appointmentTypes;
  const packages = useConfig().packages;
  const patientTypes = useConfig().patientTypes;
  const appointments = usePatients().appointments;
  const patients = usePatients().patients;
  const checks = appointments.map((e) => {
    return {
      check: e.price !== 0 || e.priceSetByUser === 1,
      id: e.id,
    };
  });

  const numberOfIncorrectPrices = checks.reduce(
    (acc, item) => (item.check === false ? acc + 1 : acc),
    0
  );
  const data = appointments.filter(
    (e) => checks.findIndex((x) => x.id === e.id && x.check === false) !== -1
  );

  return (
    <>
      {" "}
      <h2>Vérification des prix incorrects</h2>
      <div className="main-content">
        {numberOfIncorrectPrices} prix incorrects :
        <Table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Titre</th>
              <th>Date</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Consultation</th>
              <th>Profil</th>
              <th>Forfait</th>
              <th>Prix</th>
              <th>Confirmer</th>
            </tr>
          </thead>
          <tbody>
            {data.map((event) => (
              <tr key={event.id}>
                <td>
                  {patients.find((e) => e.id === event.patientId)?.fullname}
                </td>
                <td>{event.title}</td>
                <td>{displayDate(new Date(event.start), true)}</td>
                <td>{displayTime(new Date(event.start))}</td>
                <td>{displayTime(new Date(event.end))}</td>
                <td>
                  {appointmentTypes.find((e) => e.id === event.idType)?.type}
                </td>
                <td>
                  {
                    patientTypes.find(
                      (e) => e.id.toString() === event.patientType.toString()
                    )?.type
                  }
                </td>
                <td>
                  {
                    packages.find(
                      (e) =>
                        e.id ===
                        patients.find((e) => e.id === event.patientId).packageId
                    )?.package
                  }
                </td>
                <td>
                  <UpdatePrice InitialPrice={event.price} priceId={event.id} />
                </td>
                <td>
                  <ConfirmPrice InitialPrice={event.price} priceId={event.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
