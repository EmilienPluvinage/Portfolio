import { useState } from "react";
import "../styles/styles.css";
import { usePatients } from "./contexts/PatientsContext";
import { useConfig } from "./contexts/ConfigContext";
import { ReportMoney } from "tabler-icons-react";

import { Button, Modal, Table, Pagination, Center } from "@mantine/core";
import { displayDate, displayPrice } from "./Functions";
import Payement from "./Payement";

export default function Balance({ patientId, fullDisplay }) {
  const rowsPerPage = 10;
  const [activePage, setPage] = useState(1);
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

  const numberOfPages =
    data.length > 0 ? Math.floor(data.length / rowsPerPage) + 1 : 1;

  const displayedData = data.slice(
    (activePage - 1) * rowsPerPage,
    activePage * rowsPerPage
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

  const rows = displayedData.map((element) => (
    <tr key={element.id}>
      {element.dataType === "event" ? (
        <>
          <td>{displayDate(new Date(element.start))}</td>
          <td>{appointmentTypes.find((e) => e.id === element.idType)?.type}</td>
          <td style={{ color: "red" }}>- {displayPrice(element.price)} €</td>
          <td>
            {element.payed === 1 && (
              <Payement
                patientId={patientId}
                payementId={payements.find((e) => e.eventId === element.id)?.id}
              />
            )}
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
          <td>
            <Payement patientId={patientId} payementId={element.id} />
          </td>
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
        <span style={{ color: data[0]?.balance < 0 ? "red" : "inherit" }}>
          {displayPrice(data[0]?.balance) + " €"}
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
          </Modal>
        )
      )}
      {fullDisplay && (
        <Button
          onClick={() => setOpened(true)}
          leftIcon={<ReportMoney size={18} />}
          style={{ margin: "10px" }}
          color={data[0]?.balance < 0 && "red"}
        >
          Solde{" "}
          {data.length > 0 && ": " + displayPrice(data[0]?.balance) + " €"}
        </Button>
      )}
    </>
  );
}
