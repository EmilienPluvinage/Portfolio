import "../styles/styles.css";
import { usePatients } from "./contexts/PatientsContext";
import { Pagination, Table, Button, Center } from "@mantine/core";
import { useState } from "react";
import { Pencil } from "tabler-icons-react";
import { Link } from "react-router-dom";
export default function PatientList() {
  const patients = usePatients();
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
      <td>{element.birthday}</td>
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
      <h2>Liste des Patients ({patients.length})</h2>
      <div className="main-content">
        <Center>
          <Pagination
            style={{ marginBottom: "20px" }}
            page={activePage}
            onChange={setPage}
            total={10}
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
