import { useState } from "react";
import "../styles/styles.css";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { useConfig } from "./contexts/ConfigContext";
import { Check, CurrencyEuro, ReportMoney } from "tabler-icons-react";

import {
  Button,
  Center,
  Modal,
  NumberInput,
  Select,
  Table,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { displayDate, displayDateInFrench, displayPrice } from "./Functions";
import { useLogin } from "./contexts/AuthContext";
import { showNotification } from "@mantine/notifications";

export default function Balance({ patientId }) {
  const token = useLogin().token;
  const [opened, setOpened] = useState(false);
  const packages = useConfig().packages;
  const patientName = usePatients().patients.find(
    (e) => e.id === patientId
  )?.fullname;
  const appointments = usePatients().appointments.filter(
    (e) => e.patientId === patientId
  );
  const payements = usePatients().payements.filter(
    (e) => e.patientId === patientId
  );
  const appointmentTypes = useConfig().appointmentTypes;
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState("");

  const packagesData = payements
    .filter((e) => e.eventId === 0)
    .map((obj) => ({
      ...obj,
      dataType: "package",
    }));

  var data = appointments.map((obj) => ({ ...obj, dataType: "event" }));
  function insertPackageIntoArray(array, pack) {
    var index = array.findIndex((e) => e.start < pack.date);
    array.splice(index, 0, pack);
  }

  packagesData.forEach((e) => insertPackageIntoArray(data, e));

  const ths = (
    <tr>
      <th>Date</th>
      <th>Motif</th>
      <th>Débit</th>
      <th>Crédit</th>
      <th>Méthode</th>
      <th>Solde</th>
    </tr>
  );

  const rows = data.map((element) => (
    <tr key={element.id}>
      {element.dataType === "event" ? (
        <>
          <td>{displayDate(new Date(element.start))}</td>
          <td>{appointmentTypes.find((e) => e.id === element.idType)?.type}</td>
          <td style={{ color: "red" }}>- {displayPrice(element.price)} €</td>
          <td>
            {element.payed === 1 &&
              displayPrice(
                payements.find((e) => e.eventId === element.id)?.amount
              ) + " €"}
          </td>
          <td>
            {element.payed === 1 &&
              payements.find((e) => e.eventId === element.id)?.method}
          </td>
          <td></td>
        </>
      ) : (
        <>
          <td>{displayDate(new Date(element.date))}</td>
          <td>{packages.find((e) => e.id === element.packageId)?.package}</td>
          <td></td>
          <td>{displayPrice(element.amount)} €</td>
          <td>{element.method}</td>
          <td></td>
        </>
      )}
    </tr>
  ));

  return (
    <>
      {opened && (
        <Modal
          centered
          overlayOpacity={0.3}
          opened={opened}
          onClose={() => setOpened(false)}
          title={`Historique des paiements de ${patientName}`}
          closeOnClickOutside={false}
          size="50%"
        >
          <Table striped verticalSpacing="xs">
            <thead>{ths}</thead>
            <tbody>{rows}</tbody>
          </Table>
        </Modal>
      )}
      <Button
        onClick={() => setOpened(true)}
        leftIcon={<ReportMoney size={18} />}
        style={{ margin: "10px" }}
      >
        Solde
      </Button>{" "}
    </>
  );
}
