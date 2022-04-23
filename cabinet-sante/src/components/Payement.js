import { useState } from "react";
import "../styles/styles.css";

import { CurrencyEuro } from "tabler-icons-react";

import { Button, Center, Modal, NumberInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function Payement({ patientId }) {
  const [opened, setOpened] = useState(false);
  const initialValues = {
    reason: "",
    price: "",
    method: "",
  };

  const form = useForm({
    initialValues: initialValues,
  });

  function submitForm(values) {
    console.log(values);
  }
  return (
    <>
      {opened && (
        <Modal
          centered
          overlayOpacity={0.3}
          opened={opened}
          onClose={() => setOpened(false)}
          title={"Nouveau paiement"}
          closeOnClickOutside={false}
        >
          <form
            id="payement"
            onSubmit={form.onSubmit((values) => submitForm(values))}
          >
            <Select
              data={["Forfait", "Ostéo", "etc"]}
              label="Motif du paiement"
              name="reason"
              {...form.getInputProps("reason")}
              required
            />
            <NumberInput
              label="Montant"
              name="price"
              min={0}
              step={0.01}
              precision={2}
              {...form.getInputProps("price")}
              autoComplete="Off"
              required
            />
            <Select
              data={["Chèque", "Espèces", "Autre"]}
              label="Moyen de paiement"
              name="method"
              {...form.getInputProps("method")}
              required
            />
            <Center>
              <Button
                form="payement"
                onClick={form.onSubmit((values) => submitForm(values))}
                style={{ marginTop: "20px" }}
              >
                Encaisser
              </Button>
            </Center>
          </form>
        </Modal>
      )}
      <Button
        onClick={() => setOpened(true)}
        leftIcon={<CurrencyEuro size={18} />}
        style={{ margin: "10px" }}
      >
        Paiement
      </Button>{" "}
    </>
  );
}
