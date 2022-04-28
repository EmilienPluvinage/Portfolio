import { useState } from "react";
import "../styles/styles.css";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { Check, Unlink, X } from "tabler-icons-react";
import { Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useLogin } from "./contexts/AuthContext";
import Confirmation from "./Confirmation";

export default function DelinkPatients({ patientId1, patientId2 }) {
  const token = useLogin().token;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState("");
  const patients = usePatients().patients;
  const updateContext = useUpdatePatients().update;
  const patientName = patients.find((e) => e.id === patientId1)?.fullname;
  const [confirmation, setConfirmation] = useState({
    text: "",
    title: "",
    callback: undefined,
  });

  async function submitForm() {
    setLoading("loading");

    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/DelinkPatients",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId1: patientId1,
            patientId2: patientId2,
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        showNotification({
          title: "Déliés",
          message: `Le solde des patients n'est désormais plus lié.`,
          color: "green",
          icon: <Check />,
        });
        updateContext(token);
        setLoading("");
      } else {
        showNotification({
          title: "Erreur",
          message: res.error,
          color: "red",
          icon: <X />,
        });
        setLoading("");
      }
    } catch (e) {
      return e;
    }
  }

  function handleClick() {
    setConfirmation({
      title: "Suppression",
      text: "Êtes vous sûr(e) de vouloir délier ces patients?",
      callback: () => submitForm(),
    });
    setOpen(true);
  }

  return (
    <>
      <Confirmation
        text={confirmation.text}
        title={confirmation.title}
        callback={confirmation.callback}
        open={open}
        close={() => setOpen(false)}
      />

      <Button
        loading={loading}
        key={patientId1}
        leftIcon={<Unlink size={18} />}
        size={"xs"}
        variant={"outline"}
        onClick={handleClick}
      >
        {patientName}
      </Button>
    </>
  );
}
