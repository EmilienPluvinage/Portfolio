import "../styles/styles.css";
import { usePatients } from "./contexts/PatientsContext";
import { useLogin } from "./contexts/AuthContext";
import { Pagination, Table, Button, Center } from "@mantine/core";
import { calculateAge, displayFullDate } from "./Functions";
import { useState } from "react";
import { User } from "tabler-icons-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Balance from "./Balance";
import DeletePatient from "./DeletePatient";
import SortSelector from "./SortSelector";

export default function PatientList() {
  const token = useLogin().token;
  const [latestEvents, setLatestEvents] = useState([]);
  const [sort, setSort] = useState({ field: "latestEvent", direction: "up" });
  const patientsPerPage = 100;
  const patients = usePatients().patients;
  const numberOfPages =
    patients.length > 0 ? Math.floor(patients.length / patientsPerPage) + 1 : 1;
  const [activePage, setPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchResponse = await fetch(
          process.env.REACT_APP_API_DOMAIN + "/GetLatestEvents",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: token,
            }),
          }
        );
        const res = await fetchResponse.json();
        setLatestEvents(res.data);
      } catch (e) {
        return e;
      }
    }
    fetchData();
  }, [token]);

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
      default:
        x = a.lastname;
        y = b.lastname;
        break;
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

  var sortedPatients = patients.slice();
  sortedPatients.sort((a, b) => compare(a, b, sort.field, sort.direction));

  const rows = sortedPatients.map((element) => (
    <tr key={element.id}>
      <td>{element.firstname}</td>
      <td>{element.lastname}</td>
      <td>
        {element.birthday !== "" ? calculateAge(element.birthday) + " ans" : ""}
      </td>
      <td>{element.city}</td>
      <td>{element.mobilephone}</td>
      <td>{displayFullDate(new Date(latestEvent(element)))}</td>
      <td>
        <Balance patientId={element.id} fullDisplay={false} />
      </td>
      <td>
        <Link to={"/Nouveau-Patient/" + element.id}>
          <Button leftIcon={<User size={18} />} compact variant="outline">
            Accéder
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
