import "../styles/styles.css";
import { Button, Center, Modal, PasswordInput, Text } from "@mantine/core";
import { Trash } from "tabler-icons-react";
import { useState } from "react";
import { usePatients } from "./contexts/PatientsContext";

export default function DeletePatient({ patientId }) {
  const [opened, setOpened] = useState(false);
  const patients = usePatients().patients;
  const patientName = patients.find(
    (e) => e.id.toString() === patientId.toString()
  )?.fullname;
  function handleClick() {
    console.log("supprimer patient numéro %i", patientId);
    // onclick : appeler une fetch DeletePatient
    // Supprimer le patient de la table Patient
    // MAIS AUSSI
    // des tables forfaits (hasSubscribed notamment)
    // des tables isInAppointments
    // et payements
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
          />
          <Center style={{ marginTop: "20px" }}>
            <Button color="red" onClick={handleClick}>
              Confirmer la suppression
            </Button>
          </Center>
        </Modal>
      )}
      <Button
        leftIcon={<Trash size={18} />}
        compact
        variant="outline"
        color="red"
        onClick={() => setOpened(true)}
      >
        Supprimer
      </Button>
    </>
  );
}
