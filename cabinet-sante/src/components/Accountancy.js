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
    var x = new Date(a.date);
    var y = new Date(b.date);
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
      <th>Date</th>
      <th>Type</th>
      <th>Patient</th>
      <th>Montant</th>
      <th>Mode de paiement</th>
    </tr>
  );

  const filteredPayements = payements
    .filter((e) => new Date(e.date) >= value[0] && new Date(e.date) <= value[1])
    .sort(compareDate);

  const rows = filteredPayements.map((element) => (
    <tr key={element.id}>
      <td>{displayFullDate(new Date(element.date))}</td>
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

  return (
    <>
      <h2>Compta</h2>
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
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </>
  );
}
