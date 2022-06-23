import "../styles/styles.css";
import { usePatients } from "./contexts/PatientsContext";
import { Pagination, Table, Button, Center } from "@mantine/core";
import { calculateAge, displayFullDate } from "./Functions";
import { useState } from "react";
import { User } from "tabler-icons-react";
import { Link } from "react-router-dom";
import Balance from "./Balance";
import DeletePatient from "./DeletePatient";
import SortSelector from "./SortSelector";

export default function PatientList() {
  const appointments = usePatients().appointments;
  const [sort, setSort] = useState({ field: "lastname", direction: "down" });
  const patientsPerPage = 100;
  const patients = usePatients().patients;
  const numberOfPages =
    patients.length > 0 ? Math.floor(patients.length / patientsPerPage) + 1 : 1;
  const [activePage, setPage] = useState(1);

  function compareDate(a, b, n) {
    var x = new Date(a.start);
    var y = new Date(b.start);

    if (x < y) {
      return 1 * n;
    }
    if (x > y) {
      return -1 * n;
    }
    return 0;
  }

  // we want to display the latest appointment to date
  // first we filter out all the future events
  const pastEvents = appointments.filter(
    (e) => new Date(e.start) <= new Date()
  );
  // then we sort so that the latest event for each patient is at the begging of the array
  const sortedEvents = pastEvents.sort((a, b) => compareDate(a, b, 1));

  // finally we take only the first row for each patient
  const latestEvents = sortedEvents.reduce(
    (acc, element) =>
      acc.find((e) => e.patientId === element.patientId)
        ? acc
        : acc.concat([{ patientId: element.patientId, latest: element.start }]),
    []
  );

  // we also want to display the next event to date. Same as before but inverted.
  // first we filter out all the past events
  const futureEvents = appointments.filter(
    (e) => new Date(e.start) > new Date()
  );
  // then we sort so that the next event for each patient is at the begging of the array
  const sortedFutureEvents = futureEvents.sort((a, b) => compareDate(a, b, -1));

  // finally we take only the first row for each patient
  const nextEvents = sortedFutureEvents.reduce(
    (acc, element) =>
      acc.find((e) => e.patientId === element.patientId)
        ? acc
        : acc.concat([{ patientId: element.patientId, next: element.start }]),
    []
  );

  console.log(latestEvents);
  console.log(nextEvents);

  const ths = (
    <tr>
      <th>
        Prénom
        <SortSelector field="firstname" sort={sort} setSort={setSort} />
      </th>
      <th>
        Nom
        <SortSelector field="lastname" sort={sort} setSort={setSort} />
      </th>
      <th>
        Âge
        <SortSelector field="birthday" sort={sort} setSort={setSort} />
      </th>
      <th>
        Ville
        <SortSelector field="city" sort={sort} setSort={setSort} />
      </th>
      <th>Téléphone</th>
      <th>
        Dernière <br />
        Consultation
        <SortSelector field="latestEvent" sort={sort} setSort={setSort} />
      </th>
      <th>
        Prochaine <br />
        Consultation
        <SortSelector field="nextEvent" sort={sort} setSort={setSort} />
      </th>
      <th>Solde</th>
      <th>Accéder</th>
      <th>Supprimer</th>
    </tr>
  );

  function compare(a, b, field, direction) {
    var multiplier = direction === "up" ? -1 : 1;
    var x = a;
    var y = b;
    switch (field) {
      case "firstname":
        x = a.firstname;
        y = b.firstname;
        break;
      case "lastname":
        x = a.lastname;
        y = b.lastname;
        break;
      case "birthday":
        x = a.birthday;
        y = b.birthday;
        multiplier *= -1;
        break;
      case "city":
        x = a.city;
        y = b.city;
        break;
      case "latestEvent":
        x = latestEvent(a);
        y = latestEvent(b);
        break;
      case "nextEvent":
        x = nextEvent(a);
        y = nextEvent(b);
        break;
      default:
        x = a.lastname;
        y = b.lastname;
        break;
    }
    if (x === undefined) {
      return -1 * multiplier;
    }
    if (y === undefined) {
      return 1 * multiplier;
    }
    if (x < y) {
      return -1 * multiplier;
    }
    if (x > y) {
      return 1 * multiplier;
    }
    return 0;
  }

  function latestEvent(element) {
    return latestEvents.find((e) => e.patientId === element.id)?.latest;
  }

  function nextEvent(element) {
    return nextEvents.find((e) => e.patientId === element.id)?.next;
  }

  var sortedPatients = patients.slice();
  sortedPatients.sort((a, b) => compare(a, b, sort.field, sort.direction));

  const rows = sortedPatients.map((element) => (
    <tr
      key={element.id}
      style={element.death !== "" ? { color: "gray" } : null}
    >
      <td>{element.firstname}</td>
      <td>{element.lastname}</td>
      <td>
        {element.birthday !== ""
          ? calculateAge(element.birthday, element.death) + " ans"
          : ""}{" "}
        {element.death !== "" && "✞"}
      </td>
      <td>{element.city}</td>
      <td>{element.mobilephone}</td>
      <td>{displayFullDate(new Date(latestEvent(element)))}</td>
      <td>{displayFullDate(new Date(nextEvent(element)))}</td>
      <td style={{ whiteSpace: "nowrap" }}>
        <Balance patientId={element.id} fullDisplay={false} />
      </td>
      <td>
        <Link to={"/CabinetSante/Nouveau-Patient/" + element.id}>
          <Button compact variant="outline">
            <User size={18} />
          </Button>
        </Link>
      </td>
      <td>
        <DeletePatient patientId={element.id} />
      </td>
    </tr>
  ));
  return (
    <div>
      <h2>{patients.length > 0 && patients.length + " "}Patients</h2>
      <div className="main-content">
        <Center>
          <Pagination
            style={{ marginBottom: "20px" }}
            page={activePage}
            onChange={setPage}
            total={numberOfPages}
            size={"sm"}
          />
        </Center>
        <Table striped verticalSpacing="xs">
          <thead>{ths}</thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </div>
  );
}
