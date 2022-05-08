import "../styles/styles.css";
import { DateRangePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { useState } from "react";
import { Button, Center, Table } from "@mantine/core";
import { usePatients } from "./contexts/PatientsContext";
import { useConfig } from "./contexts/ConfigContext";
import { displayFullDate, displayPrice } from "./Functions";

function DateButton({ children, setValue, start, end }) {
  return (
    <Button
      onClick={() => setValue([start, end])}
      variant="outline"
      size="xs"
      style={{ margin: "5px" }}
    >
      {children}
    </Button>
  );
}

export default function Accountancy() {
  const patients = usePatients().patients;
  const payements = usePatients().payements;
  const appointmentTypes = useConfig().appointmentTypes;
  const packages = useConfig().packages;
  const parameters = useConfig().parameters;
  const appointments = usePatients().appointments;
  const now = new Date();
  const yesterday = dayjs(now).subtract(1, "days").toDate();
  const startOfMonth = dayjs(now).startOf("month").toDate();
  const endOfPreviousMonth = dayjs(startOfMonth).subtract(1, "days").toDate();
  const startOfPreviousMonth = dayjs(endOfPreviousMonth)
    .startOf("month")
    .toDate();
  const startOfYear = dayjs(now).startOf("year").toDate();
  const endOfPreviousYear = dayjs(startOfYear).subtract(1, "days").toDate();
  const startOfPreviousYear = dayjs(endOfPreviousYear).startOf("year").toDate();
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
      <th>Date du paiement</th>
      <th>Date du rendez-vous</th>
      <th>Type</th>
      <th>Patient</th>
      <th>Montant</th>
      <th>Mode de paiement</th>
    </tr>
  );

  const filteredPayements = payements
    .filter(
      (e) =>
        new Date(e.date) >=
          dayjs(value[0]).subtract(1, "days").hour(23).minute(59).toDate() &&
        new Date(e.date) <= dayjs(value[1]).hour(23).minute(59).toDate()
    )
    .sort(compareDate);

  const rows = filteredPayements.map((element) => (
    <tr key={element.id}>
      <td>{displayFullDate(new Date(element.date))}</td>
      <td>
        {element?.eventId !== 0 &&
          displayFullDate(
            new Date(appointments.find((e) => e.id === element?.eventId)?.start)
          )}
      </td>
      <td>
        {element.eventId !== 0
          ? appointmentTypes.find(
              (x) =>
                appointments.find((e) => e.id === element.eventId)?.idType ===
                x.id
            )?.type
          : packages.find((e) => e.id === element.packageId)?.package}
      </td>
      <td>
        {
          patients.find(
            (x) =>
              x.id ===
              (element.eventId !== 0
                ? element.eventPatientId
                : element.packagePatientId)
          )?.fullname
        }
      </td>
      <td>{displayPrice(element.amount)} €</td>
      <td>{element.method}</td>
    </tr>
  ));

  // calculating overall total
  const total = filteredPayements.reduce((acc, item) => acc + item.amount, 0);

  // calculating total by payement methods
  const payementMethods = parameters.filter((e) => e.name === "payementMethod");
  var totalsByMethod = new Array(payementMethods?.length).fill(0);
  filteredPayements.forEach((element) => {
    var index = payementMethods.findIndex(
      (method) => method.value === element.method
    );
    if (index !== -1) {
      totalsByMethod[index] += element.amount;
    } else {
      totalsByMethod[totalsByMethod?.length - 1] += element.amount;
    }
  });

  // Finally we check if there are any appointments that have not been paid (payed === 0) and need to be displayed (alert === 1)
  // We won't count them in the total but we just display them as information

  const filteredAppointments = appointments
    .filter(
      (e) =>
        new Date(e.start) >= value[0] &&
        new Date(e.start) <= value[1] &&
        e.payed === 0 &&
        appointmentTypes.find((f) => f.id === e.idType)?.alert === 1
    )
    .sort(compareDate);

  const alertRows = filteredAppointments.map((element) => (
    <tr key={"event" + element.id} style={{ backgroundColor: "#FFE3E3" }}>
      <td></td>
      <td>{displayFullDate(new Date(element.start))}</td>
      <td>{appointmentTypes.find((f) => f.id === element.idType)?.type}</td>
      <td>{patients.find((e) => e.id === element.patientId)?.fullname}</td>
      <td>{displayPrice(element.price)} €</td>
      <td>Non réglé</td>
    </tr>
  ));

  return (
    <>
      <h2>Comptabilité</h2>
      <div className="main-content">
        <Center style={{ flexWrap: "wrap" }}>
          <DateButton setValue={setValue} start={yesterday} end={yesterday}>
            Hier
          </DateButton>
          <DateButton setValue={setValue} start={now} end={now}>
            Aujourd'hui
          </DateButton>
          <DateButton
            setValue={setValue}
            start={startOfPreviousMonth}
            end={endOfPreviousMonth}
          >
            Le mois dernier
          </DateButton>
          <DateButton setValue={setValue} start={startOfMonth} end={now}>
            Ce mois-ci
          </DateButton>
          <DateButton
            setValue={setValue}
            start={startOfPreviousYear}
            end={endOfPreviousYear}
          >
            L'année dernière
          </DateButton>
          <DateButton setValue={setValue} start={startOfYear} end={now}>
            Cette année
          </DateButton>
        </Center>
        <Center>
          <div style={{ width: "fit-content" }}>
            <DateRangePicker
              label="Sélectionnez la période à afficher"
              placeholder="Période à afficher"
              locale="fr"
              value={value}
              onChange={setValue}
              maxDate={new Date(Date.now())}
              inputFormat="DD/MM/YYYY"
            />
          </div>
        </Center>
        <Table striped verticalSpacing="xs">
          <thead>{ths}</thead>
          <tbody>
            {alertRows}
            {rows}
            {payementMethods.map((element, index) => (
              <tr key={element.value} style={{ backgroundColor: "#E3FAFC" }}>
                <td colSpan={4} style={{ textAlign: "right" }}>
                  {element.value} :
                </td>
                <td colSpan={2}>
                  <b>{displayPrice(totalsByMethod[index])} €</b>
                </td>
              </tr>
            ))}
            <tr key="total" style={{ backgroundColor: "#E3FAFC" }}>
              <td colSpan={4} style={{ textAlign: "right" }}>
                <b>Total :</b>
              </td>

              <td colSpan={2}>
                <b>{displayPrice(total)} €</b>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
}
