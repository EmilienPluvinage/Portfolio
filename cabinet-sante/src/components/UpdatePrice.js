import "../styles/styles.css";
import { useUpdatePatients } from "./contexts/PatientsContext";
import { Button, NumberInput, Center, Modal } from "@mantine/core";
import { displayPrice } from "./Functions";
import { useLogin } from "./contexts/AuthContext";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { Check } from "tabler-icons-react";

export default function UpdatePrice({ InitialPrice, priceId }) {
  // This component is going to display the price and offer the possibility to update it
  const token = useLogin().token;
  const updateAppointments = useUpdatePatients().update;
  const [price, setPrice] = useState(0);
  const [openedPrice, setOpenedPrice] = useState(false);

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
      <Button size="xs" variant="default" onClick={() => openPriceModal()}>
        {" "}
        {displayPrice(InitialPrice)} €
      </Button>
    </>
  );
}
