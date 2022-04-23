import { useState } from "react";
import "../styles/styles.css";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { useConfig } from "./contexts/ConfigContext";
import { Check, CurrencyEuro, ReportMoney } from "tabler-icons-react";

import { Button, Center, Modal, NumberInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { displayDateInFrench, displayPrice } from "./Functions";
import { useLogin } from "./contexts/AuthContext";
import { showNotification } from "@mantine/notifications";

export default function Balance({ patientId }) {
  const token = useLogin().token;
  const [opened, setOpened] = useState(false);
  const appointments = usePatients().appointments;
  const appointmentTypes = useConfig().appointmentTypes;
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState("");

  return (
    <>
      {opened && (
        <Modal
          centered
          overlayOpacity={0.3}
          opened={opened}
          onClose={() => setOpened(false)}
          title={"Historique des paiements"}
          closeOnClickOutside={false}
          size="50%"
        >
          Historique
        </Modal>
      )}
      <Button
        onClick={() => setOpened(true)}
        leftIcon={<ReportMoney size={18} />}
        style={{ margin: "10px" }}
      >
        Solde
      </Button>{" "}
    </>
  );
}
