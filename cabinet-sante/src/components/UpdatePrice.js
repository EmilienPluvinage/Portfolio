import "../styles/styles.css";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { Button, NumberInput, Center, Modal } from "@mantine/core";
import { displayPrice } from "./Functions";
import { useLogin } from "./contexts/AuthContext";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { Check } from "tabler-icons-react";
import Confirmation from "./Confirmation";

export default function UpdatePrice({
  InitialPrice,
  priceId,
  missed,
  displayType,
}) {
  // This component is going to display the price and offer the possibility to update it
  const token = useLogin().token;
  const missedAppointments = usePatients().missedAppointments;
  const notMissedAppointments = usePatients().appointments;
  const appointments = missed ? missedAppointments : notMissedAppointments;

  const updateAppointments = useUpdatePatients().update;
  const [price, setPrice] = useState(0);
  const [openedPrice, setOpenedPrice] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState({
    text: "",
    title: "",
    callback: undefined,
  });

  function openPriceModal() {
    setPrice(InitialPrice / 100);
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
            missed: missed,
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

  function handleClick() {
    if (alreadyPayed(priceId)) {
      setConfirmation({
        title: "Modifier le prix",
        text: "Cette consultation a déjà été payée. Êtes-vous sûr(e) de vouloir en changer le prix?",
        callback: () => openPriceModal(),
      });
      setOpen(true);
    } else {
      openPriceModal();
    }
  }

  function alreadyPayed(priceId) {
    return appointments.find((e) => e.id === priceId).payed === 1;
  }
  return (
    <>
      <Confirmation
        text={confirmation.text}
        title={confirmation.title}
        callback={confirmation.callback}
        open={open}
        close={() => setOpen(false)}
      />{" "}
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
            <form>
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
                <Button style={{ marginTop: "20px" }} onClick={updatePrice}>
                  Modifier
                </Button>
              </Center>
            </form>
          </Center>
        )}
      </Modal>
      {displayType === "negative" ? (
        <Button
          size="xs"
          color={"red"}
          variant="outline"
          onClick={() => handleClick()}
        >
          {" "}
          - {displayPrice(InitialPrice)} €
        </Button>
      ) : (
        <Button size="xs" variant="default" onClick={() => handleClick()}>
          {" "}
          {displayPrice(InitialPrice)} €
        </Button>
      )}
    </>
  );
}
