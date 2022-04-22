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
  const historyData = appointments.filter((e) => e.patientId === patientId);
  const numberOfPages =
    historyData.length > 0
      ? Math.floor(historyData.length / rowsPerPage) + 1
      : 1;
  const [activePage, setPage] = useState(1);
  const [opened, setOpened] = useState(false);
  const [openedDetails, setOpenedDetails] = useState(false);
  const [appointmentId, setAppointmentId] = useState(0);
  const appointmentTypes = useConfig().appointmentTypes;
  const displayedData = historyData.slice(
    (activePage - 1) * 10,
    activePage * 10
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
            <th>Début</th>
            <th>Fin</th>
            <th>Type</th>
            <th>Prix</th>
            <th>Détails</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{displayDate(new Date(event.start), true)}</td>
              <td>{displayTime(new Date(event.start))}</td>
              <td>{displayTime(new Date(event.end))}</td>
              <td>
                {appointmentTypes.find((e) => e.id === event.idType).type}
              </td>
              <td>
                <UpdatePrice InitialPrice={event.price} priceId={event.id} />
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
