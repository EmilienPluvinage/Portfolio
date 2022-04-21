import "../styles/styles.css";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { Table, Button, NumberInput, Center, Modal } from "@mantine/core";
import { displayDate, displayPrice, displayTime } from "./Functions";
import { useConfig } from "./contexts/ConfigContext";
import { useLogin } from "./contexts/AuthContext";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { Check } from "tabler-icons-react";

export default function IncorrectPricesList() {
  // This component is going to display potential incorrect prices for the user to confirm, we the possibility to update them one by one, or to confirm them all in one go.
  const token = useLogin().token;
  const appointmentTypes = useConfig().appointmentTypes;
  const appointments = usePatients().appointments;
  const updateAppointments = useUpdatePatients().update;
  const patients = usePatients().patients;
  const [price, setPrice] = useState(0);
  const [priceId, setPriceId] = useState(0);
  const [openedPrice, setOpenedPrice] = useState(false);
  const [appointmentId, setAppointmentId] = useState(0);
  const checks = appointments.map((e) => {
    return {
      check: e.price !== 0 || e.priceSetByUser === true,
      id: e.id,
    };
  });

  const numberOfIncorrectPrices = checks.reduce(
    (acc, item) => (item.check === false ? acc + 1 : acc),
    0
  );
  const data = appointments.filter(
    (e) => checks.findIndex((x) => x.id === e.id && x.check === false) !== -1
  );

  function openPriceModal(id, price, appointmentId) {
    setPrice(price / 100);
    setPriceId(id);
    setAppointmentId(appointmentId);
    setOpenedPrice(true);
  }
  async function updatePrice(event) {
    var patientId = appointments.find((e) => e.id === priceId).patientId;
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
      {" "}
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
      <h2>Vérification des prix incorrects</h2>
      <div className="main-content">
        {numberOfIncorrectPrices} prix incorrects :
        <Table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Titre</th>
              <th>Date</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Type</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            {data.map((event) => (
              <tr key={event.id}>
                <td>
                  {patients.find((e) => e.id === event.patientId).fullname}
                </td>
                <td>{event.title}</td>
                <td>{displayDate(new Date(event.start), true)}</td>
                <td>{displayTime(new Date(event.start))}</td>
                <td>{displayTime(new Date(event.end))}</td>
                <td>
                  {appointmentTypes.find((e) => e.id === event.idType)?.type}
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
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
