import React, { useState } from "react";
import { useLogin } from "./contexts/AuthContext";
import {
  Pagination,
  Table,
  Button,
  Center,
  Modal,
  NumberInput,
} from "@mantine/core";
import { displayDate, displayPrice, displayTime } from "./Functions";
import { Check, Search } from "tabler-icons-react";
import NewAppointment from "./NewAppointment";
import AppointmentDetails from "./AppointmentDetails";
import { useConfig } from "./contexts/ConfigContext";
import { showNotification } from "@mantine/notifications";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";

export default function History({ patientId }) {
  const token = useLogin().token;
  const rowsPerPage = 10;
  const appointments = usePatients().appointments;
  const updateAppointments = useUpdatePatients().update;
  const historyData = appointments.filter((e) => e.patientId === patientId);
  const numberOfPages =
    historyData.length > 0
      ? Math.floor(historyData.length / rowsPerPage) + 1
      : 1;
  const [activePage, setPage] = useState(1);
  const [opened, setOpened] = useState(false);
  const [price, setPrice] = useState(0);
  const [priceId, setPriceId] = useState(0);
  const [openedDetails, setOpenedDetails] = useState(false);
  const [openedPrice, setOpenedPrice] = useState(false);
  const [appointmentId, setAppointmentId] = useState(0);
  const appointmentTypes = useConfig().appointmentTypes;

  function handleClick(id, multi) {
    setAppointmentId(id);
    if (multi === 1) {
      setOpened(true);
    } else {
      setOpenedDetails(true);
    }
  }

  function openPriceModal(id, price, appointmentId) {
    setPrice(price / 100);
    setPriceId(id);
    setAppointmentId(appointmentId);
    setOpenedPrice(true);
  }
  async function updatePrice(event) {
    event.preventDefault();
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/UpdatePrice",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: priceId,
            price: Math.round(price * 100),
            priceSetByUser: true,
            token: token,
            patientId: patientId,
            appointmentId: appointmentId,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        // now that's it's done we update the data displayed in the table
        updateAppointments(token);
        setOpenedPrice(false);
        showNotification({
          title: "Prix Modifié",
          message: "Le prix de la consultation a bien été mis à jour",
          icon: <Check />,
          color: "green",
        });
      }
    } catch (e) {
      return e;
    }
  }
  return (
    <>
      <Modal
        centered
        overlayOpacity={0.3}
        opened={openedPrice}
        onClose={() => setOpenedPrice(false)}
        title={"Modifier le prix"}
        closeOnClickOutside={false}
      >
        {openedPrice && (
          <Center>
            <form onSubmit={updatePrice}>
              <NumberInput
                label="Prix"
                min={0}
                precision={2}
                step={0.01}
                value={price}
                onChange={setPrice}
                hideControls
              />
              <Center>
                <Button style={{ marginTop: "20px" }} type="submit">
                  Modifier
                </Button>
              </Center>
            </form>
          </Center>
        )}
      </Modal>

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
          {historyData.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{displayDate(new Date(event.start), true)}</td>
              <td>{displayTime(new Date(event.start))}</td>
              <td>{displayTime(new Date(event.end))}</td>
              <td>
                {appointmentTypes.find((e) => e.id === event.idType).type}
              </td>
              <td>
                <Button
                  size="xs"
                  variant="default"
                  onClick={() =>
                    openPriceModal(event.id, event.price, event.appointmentId)
                  }
                >
                  {" "}
                  {displayPrice(event.price)} €
                </Button>
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
