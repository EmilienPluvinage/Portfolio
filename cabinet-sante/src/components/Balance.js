import { useState } from "react";
import "../styles/styles.css";
import { usePatients } from "./contexts/PatientsContext";
import { useConfig } from "./contexts/ConfigContext";
import { ReportMoney } from "tabler-icons-react";

import { Button, Modal, Table } from "@mantine/core";
import { displayDate, displayPrice } from "./Functions";

export default function Balance({ patientId, fullDisplay }) {
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

  const balance = data.reduceRight(
    (acc, item) =>
      item.dataType === "event"
        ? acc.concat(
            (acc.length > 0 ? acc[acc.length - 1] : 0) -
              (item.payed === 1 ? 0 : item.price)
          )
        : acc.concat((acc.length > 0 ? acc[acc.length - 1] : 0) + item.amount),
    []
  );

  data.forEach(
    (obj, index) =>
      (data[index] = { ...obj, balance: balance[balance.length - 1 - index] })
  );

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
          <td style={{ color: element.balance < 0 ? "red" : "inherit" }}>
            {displayPrice(element.balance)} €
          </td>
        </>
      ) : (
        <>
          <td>{displayDate(new Date(element.date))}</td>
          <td>{packages.find((e) => e.id === element.packageId)?.package}</td>
          <td></td>
          <td>{displayPrice(element.amount)} €</td>
          <td>{element.method}</td>

          <td style={{ color: element.balance < 0 ? "red" : "inherit" }}>
            {displayPrice(element.balance)} €
          </td>
        </>
      )}
    </tr>
  ));

  return (
    <>
      {!fullDisplay ? (
        <span style={{ color: data[0].balance < 0 ? "red" : "inherit" }}>
          {displayPrice(data[0].balance) + " €"}
        </span>
      ) : (
        opened && (
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
        )
      )}
      {fullDisplay && (
        <Button
          onClick={() => setOpened(true)}
          leftIcon={<ReportMoney size={18} />}
          style={{ margin: "10px" }}
        >
          Solde {data.length > 0 && ": " + displayPrice(data[0].balance) + " €"}
        </Button>
      )}
    </>
  );
}
