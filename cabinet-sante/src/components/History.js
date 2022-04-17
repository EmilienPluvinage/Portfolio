import React, { useEffect, useState } from "react";
import { useLogin } from "./contexts/AuthContext";
import { Pagination, Table, Button, Center, Modal } from "@mantine/core";
import { displayDate, displayTime } from "./Functions";
import { Search } from "tabler-icons-react";
import NewAppointment from "./NewAppointment";
import AppointmentDetails from "./AppointmentDetails";
import { useConfig } from "./contexts/ConfigContext";

export default function History({ patientId }) {
  const token = useLogin().token;
  const rowsPerPage = 10;
  const [historyData, setHistoryData] = useState([]);
  const numberOfPages =
    historyData.length > 0
      ? Math.floor(historyData.length / rowsPerPage) + 1
      : 1;
  const [activePage, setPage] = useState(1);
  const [opened, setOpened] = useState(false);
  const [openedDetails, setOpenedDetails] = useState(false);
  const [appointmentId, setAppointmentId] = useState(0);
  const [update, setUpdate] = useState(0);
  const appointmentTypes = useConfig().appointmentTypes;

  useEffect(() => {
    async function getData() {
      try {
        const fetchResponse = await fetch(
          process.env.REACT_APP_API_DOMAIN + "/GetHistory",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: token,
              patientId: patientId,
            }),
          }
        );
        const res = await fetchResponse.json();
        if (res.success) {
          setHistoryData(res.data);
        }
      } catch (e) {
        return e;
      }
    }
    getData();
  }, [token, patientId, update, opened]);

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
            setUpdate={setUpdate}
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
          {historyData.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{displayDate(new Date(event.start), true)}</td>
              <td>{displayTime(new Date(event.start))}</td>
              <td>{displayTime(new Date(event.end))}</td>
              <td>
                {appointmentTypes.find((e) => e.id === event.idType).type}
              </td>
              <td>Prix</td>
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
