import React, { useState } from "react";
import { Pagination, Table, Button, Center, Modal } from "@mantine/core";
import { displayDate, displayTime } from "./Functions";
import { Search } from "tabler-icons-react";
import NewAppointment from "./NewAppointment";
import AppointmentDetails from "./AppointmentDetails";
import { useConfig } from "./contexts/ConfigContext";
import { usePatients } from "./contexts/PatientsContext";
import UpdatePrice from "./UpdatePrice";

export default function History({ patientId }) {
  const rowsPerPage = 10;
  const appointments = usePatients().appointments;
  const missedAppointments = usePatients().missedAppointments;
  let appointmentsData = appointments.filter((e) => e.patientId === patientId);
  for (const element of appointmentsData) {
    element.missed = false;
  }
  let missedAppointmentsData = missedAppointments.filter(
    (e) => e.patientId === patientId
  );
  for (const element of missedAppointmentsData) {
    element.missed = true;
  }

  let historyData = appointmentsData.concat(missedAppointmentsData);

  function compareDate(a, b) {
    let x = new Date(a.start);
    let y = new Date(b.start);

    if (x < y) {
      return 1;
    }
    if (x > y) {
      return -1;
    }
    return 0;
  }

  historyData.sort((a, b) => compareDate(a, b));

  const numberOfPages =
    historyData.length > 0
      ? Math.floor((historyData.length - 1) / rowsPerPage) + 1
      : 1;
  const [activePage, setPage] = useState(1);
  const [opened, setOpened] = useState(false);
  const [openedDetails, setOpenedDetails] = useState(false);
  const [appointmentId, setAppointmentId] = useState(0);
  const appointmentTypes = useConfig().appointmentTypes;
  const displayedData = historyData.slice(
    (activePage - 1) * rowsPerPage,
    activePage * rowsPerPage
  );

  function handleClick(id, multi) {
    setAppointmentId(id);
    if (multi === 1) {
      setOpened(true);
    } else {
      setOpenedDetails(true);
    }
  }

  return (
    <>
      <Modal
        centered
        overlayOpacity={0.3}
        opened={opened}
        onClose={() => setOpened(false)}
        title={"Consultation"}
        closeOnClickOutside={false}
      >
        {opened && (
          <NewAppointment
            setOpened={setOpened}
            startingTime={0}
            patientId={0}
            appointmentId={appointmentId}
          />
        )}
      </Modal>
      <Modal
        centered
        overlayOpacity={0.3}
        opened={openedDetails}
        onClose={() => setOpenedDetails(false)}
        title={"Consultation"}
        closeOnClickOutside={false}
        size="50%"
      >
        {openedDetails && (
          <AppointmentDetails
            setOpened={setOpenedDetails}
            patientId={0}
            appointmentId={appointmentId}
          />
        )}
      </Modal>
      <Center>
        <Pagination
          style={{ marginBottom: "20px" }}
          page={activePage}
          onChange={setPage}
          total={numberOfPages}
          size={"sm"}
        />
      </Center>
      <Table>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Date</th>
            <th style={{ whiteSpace: "nowrap" }}>D??but</th>
            <th style={{ whiteSpace: "nowrap" }}>Fin</th>
            <th style={{ whiteSpace: "nowrap" }}>Type</th>
            <th>Prix</th>
            <th>D??tails</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((event) => (
            <tr
              key={event.id}
              style={event.missed ? { color: "red" } : { color: "black" }}
            >
              <td>{event.title}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                {displayDate(new Date(event.start), true)}
              </td>
              <td style={{ whiteSpace: "nowrap" }}>
                {displayTime(new Date(event.start))}
              </td>
              <td style={{ whiteSpace: "nowrap" }}>
                {displayTime(new Date(event.end))}
              </td>
              <td style={{ whiteSpace: "nowrap" }}>
                {appointmentTypes.find((e) => e.id === event.idType).type}
              </td>
              <td>
                <UpdatePrice
                  InitialPrice={event.price}
                  priceId={event.id}
                  missed={event.missed}
                />
              </td>
              <td>
                <Button
                  size="xs"
                  onClick={() =>
                    handleClick(
                      event.appointmentId,
                      appointmentTypes.find((e) => e.id === event.idType).multi
                    )
                  }
                >
                  <Search size={18} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
