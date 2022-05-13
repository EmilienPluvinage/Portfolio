import { useState } from "react";
import "../styles/styles.css";
import { usePatients } from "./contexts/PatientsContext";
import { useConfig } from "./contexts/ConfigContext";
import { ReportMoney } from "tabler-icons-react";

import { Button, Modal, Table, Pagination, Center } from "@mantine/core";
import {
  displayDate,
  displayPrice,
  getUniqueSharedPatients,
  calculateBalance,
  insertPackageIntoArray,
} from "./Functions";
import Payement from "./Payement";
import ShareBalance from "./ShareBalance";
import UpdatePrice from "./UpdatePrice";

export default function Balance({ patientId, fullDisplay, warningDisplay }) {
  // data from context
  const packages = useConfig().packages;
  const sharedBalance = usePatients().sharedBalance;
  const patients = usePatients().patients;
  const sharedPatients = getUniqueSharedPatients(sharedBalance, patientId);
  const patientName = usePatients().patients.find(
    (e) => e.id === patientId
  )?.fullname;
  const appointments = usePatients().appointments.filter(
    (e) => sharedPatients.findIndex((f) => f === e.patientId) !== -1
  );
  const payements = usePatients().payements.filter(
    (e) => sharedPatients.findIndex((f) => f === e.patientId) !== -1
  );
  const appointmentTypes = useConfig().appointmentTypes;

  // navigation
  const rowsPerPage = 10;
  const [activePage, setPage] = useState(1);
  const [opened, setOpened] = useState(false);

  // used to exclude future appointments into balance calculation
  const today = new Date();

  const packagesData = payements
    .filter((e) => e.eventId === 0)
    .map((obj) => ({
      ...obj,
      dataType: "package",
    }));

  var data = appointments.map((obj) => ({ ...obj, dataType: "event" }));

  packagesData.forEach((e) => insertPackageIntoArray(data, e));

  calculateBalance(data, payements);

  const numberOfPages =
    data.length > 0 ? Math.ceil(data.length / rowsPerPage) : 1;

  const displayedData = data.slice(
    (activePage - 1) * rowsPerPage,
    activePage * rowsPerPage
  );

  const ths = (
    <tr>
      <th>Date</th>
      {sharedPatients.length > 1 && <th>Patient</th>}
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
          {sharedPatients.length > 1 && (
            <td>
              {patients.find((e) => e.id === element.patientId)?.fullname}
            </td>
          )}
          <td>{appointmentTypes.find((e) => e.id === element.idType)?.type}</td>
          <td>
            {" "}
            <UpdatePrice
              InitialPrice={element.price}
              priceId={element.id}
              displayType="negative"
            />
          </td>
          <td>
            {element.payed === 1 && (
              <Payement
                patientId={element.patientId}
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
          {sharedPatients.length > 1 && (
            <td>
              {patients.find((e) => e.id === element.patientId)?.fullname}
            </td>
          )}
          <td>{packages.find((e) => e.id === element.packageId)?.package}</td>
          <td></td>
          <td>
            <Payement patientId={element.patientId} payementId={element.id} />
          </td>
          <td>{element.method}</td>

          <td style={{ color: element.balance < 0 ? "red" : "inherit" }}>
            {displayPrice(element.balance)} €
          </td>
        </>
      )}
    </tr>
  ));

  const balanceAsOfToday = data.filter(
    (element) =>
      new Date(element?.date) <= today || new Date(element?.start) <= today
  )[0]?.balance;

  return (
    <>
      {!fullDisplay && !warningDisplay ? (
        <span style={{ color: balanceAsOfToday < 0 ? "red" : "inherit" }}>
          {displayPrice(balanceAsOfToday) + " €"}
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
            size="80%"
          >
            <ShareBalance patientId={patientId} />
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
          color={balanceAsOfToday < 0 && "red"}
        >
          Solde{" "}
          {data.length > 0 && ": " + displayPrice(balanceAsOfToday) + " €"}
        </Button>
      )}
      {warningDisplay && balanceAsOfToday < 0 && (
        <tr key={balanceAsOfToday}>
          <td>{patientName}</td>
          <td>
            <span style={{ color: balanceAsOfToday < 0 ? "red" : "inherit" }}>
              {displayPrice(balanceAsOfToday) + " €"}
            </span>
          </td>
        </tr>
      )}
    </>
  );
}
