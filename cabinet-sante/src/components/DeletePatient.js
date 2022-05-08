import "../styles/styles.css";
import { Button, Center, Modal, PasswordInput, Text } from "@mantine/core";
import { Check, Trash, X } from "tabler-icons-react";
import { useState } from "react";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { useLogin } from "./contexts/AuthContext";
import { showNotification } from "@mantine/notifications";

export default function DeletePatient({ patientId }) {
  const [loading, setLoading] = useState("");
  const [opened, setOpened] = useState(false);
  const [password, setPassword] = useState("");
  const token = useLogin().token;
  const patients = usePatients().patients;
  const updateContext = useUpdatePatients().update;
  const patientName = patients.find(
    (e) => e.id.toString() === patientId.toString()
  )?.fullname;

  async function handleClick() {
    console.log("supprimer patient numéro %i", patientId);
    setLoading("loading");

    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/DeletePatient",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: patientId,
            password: password,
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        showNotification({
          title: "Supprimé",
          message: `Le patient ${patientName} a bien été supprimé`,
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
    // onclick : appeler une fetch DeletePatient
    // Supprimer le patient de la table Patient
    // MAIS AUSSI
    // des tables forfaits (hasSubscribed notamment)
    // des tables isInAppointments
    // et payements
    // et sharedBalance
    // et vérifier que le mot de passe correspond bien au token et au patient
  }
  return (
    <>
      {opened && (
        <Modal
          centered
          overlayOpacity={0.3}
          opened={opened}
          onClose={() => setOpened(false)}
          title={`Supprimer le patient ${patientName}`}
          closeOnClickOutside={false}
        >
          <Text>
            Confirmez-vous vouloir supprimer ce patient? Cette opération est
            irréversible. Pour confirmer, merci d'entrer votre mot de passe
            ci-dessous.
          </Text>
          <PasswordInput
            style={{ marginTop: "20px" }}
            name="password"
            autoComplete="new-password"
            label="Mot de passe"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          <Center style={{ marginTop: "20px" }}>
            <Button loading={loading} color="red" onClick={handleClick}>
              Confirmer la suppression
            </Button>
          </Center>
        </Modal>
      )}
      <Button
        compact
        variant="outline"
        color="red"
        onClick={() => setOpened(true)}
      >
        <Trash size={18} />
      </Button>
    </>
  );
}
