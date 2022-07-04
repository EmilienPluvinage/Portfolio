import "../styles/styles.css";
import dayjs from "dayjs";
import { useState } from "react";
import { Table } from "@mantine/core";
import { usePatients } from "./contexts/PatientsContext";
import { useConfig } from "./contexts/ConfigContext";
import { displayFullDate, displayPrice } from "./Functions";
import DateSelector from "./DateSelector";
import { Link } from "react-router-dom";

export default function Summary() {
  const patients = usePatients().patients;
  const appointmentTypes = useConfig().appointmentTypes;
  const appointments = usePatients().appointments;
  const now = new Date();
  const startOfMonth = dayjs(now).startOf("month").toDate();
  const [value, setValue] = useState([startOfMonth, now]);

  function compareDate(a, b) {
    var x = new Date();
    var y = new Date();
    if (a.date) {
      x = new Date(a.date);
      y = new Date(b.date);
    } else {
      x = new Date(a.start);
      y = new Date(b.start);
    }
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  }

  const ths = (
    <tr>
      <th>Date du rendez-vous</th>
      <th>Titre</th>
      <th>Type</th>
      <th>Patient</th>
      <th>Prix</th>
    </tr>
  );

  const filteredAppointments = appointments
    .filter(
      (e) =>
        new Date(e.start) >=
          dayjs(value[0]).subtract(1, "days").hour(23).minute(59).toDate() &&
        new Date(e.start) <= dayjs(value[1]).hour(23).minute(59).toDate()
    )
    .filter((e) => e.id !== null)
    .sort(compareDate);

  const rows = filteredAppointments.map((element) => (
    <tr key={element.id}>
      <td>{displayFullDate(new Date(element.start))}</td>
      <td>{element.title}</td>
      <td>{appointmentTypes.find((x) => x.id === element.idType)?.type}</td>
      <td>
        <Link
          to={"/CabinetSante/Nouveau-Patient/" + element.patientId}
          className="link"
        >
          {patients.find((x) => x.id === element.patientId)?.fullname}
        </Link>
      </td>
      {console.log(element.price)}
      <td>{element.price ? displayPrice(element.price) + " €" : ""} </td>
    </tr>
  ));

  // calculating overall total
  const total = filteredAppointments.reduce((acc, item) => acc + item.price, 0);

  return (
    <>
      <h2>Résumé</h2>
      <div className="main-content">
        <DateSelector value={value} setValue={setValue} />
        <Table striped verticalSpacing="xs">
          <thead>{ths}</thead>
          <tbody>
            {rows}
            <tr>
              <td colSpan={4} style={{ textAlign: "right" }}>
                Total :
              </td>
              <td>{displayPrice(total)} €</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
}
