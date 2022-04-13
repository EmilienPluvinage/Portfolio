import "../styles/styles.css";
import { usePatients } from "./contexts/PatientsContext";
import { Pagination, Table, Button, Center } from "@mantine/core";
import { calculateAge } from "./Functions";
import { useState } from "react";
import { Pencil } from "tabler-icons-react";
import { Link } from "react-router-dom";
export default function PatientList() {
  const patientsPerPage = 100;
  const patients = usePatients();
  console.log(patients);
  const numberOfPages =
    patients.length > 0 ? Math.floor(patients.length / patientsPerPage) + 1 : 1;
  const [activePage, setPage] = useState(1);

  const ths = (
    <tr>
      <th>Nom</th>
      <th>Prénom</th>
      <th>Âge</th>
      <th>Ville</th>
      <th>Téléphone</th>
      <th>Dernière Consultation</th>
      <th>Modification</th>
    </tr>
  );

  const rows = patients.map((element) => (
    <tr key={element.id}>
      <td>{element.firstname}</td>
      <td>{element.lastname}</td>
      <td>
        {element.birthday !== "" ? calculateAge(element.birthday) + " ans" : ""}
      </td>
      <td>{element.city}</td>
      <td>{element.mobilephone}</td>
      <td> </td>
      <td>
        <Link to={"/Nouveau-Patient/" + element.id}>
          <Button leftIcon={<Pencil size={18} />} compact variant="outline">
            Modifier
          </Button>
        </Link>
      </td>
    </tr>
  ));
  return (
    <div>
      <h2>Liste des Patients</h2>
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
