import "../styles/styles.css";
import { useUpdatePatients } from "./contexts/PatientsContext";
import { Button } from "@mantine/core";
import { useLogin } from "./contexts/AuthContext";
import { showNotification } from "@mantine/notifications";
import { Check } from "tabler-icons-react";

export default function ConfirmPrice({ InitialPrice, priceId }) {
  // This component is going to display the price and offer the possibility to update it
  const token = useLogin().token;
  const updateAppointments = useUpdatePatients().update;

  async function confirmPrice(event) {
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
            price: InitialPrice,
            priceSetByUser: true,
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        // now that's it's done we update the data displayed in the table
        updateAppointments(token);
        showNotification({
          title: "Prix Confirmé",
          message: "Le prix de la consultation a bien été confirmé",
          icon: <Check />,
          color: "green",
        });
      }
    } catch (e) {
      return e;
    }
  }
  return (
    <Button size="xs" variant="outline" onClick={confirmPrice}>
      {" "}
      Confirmer
    </Button>
  );
}
