import { useState } from "react";
import "../styles/styles.css";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { useConfig } from "./contexts/ConfigContext";
import { Check, CurrencyEuro } from "tabler-icons-react";

import { Button, Center, Modal, NumberInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { displayDateInFrench, displayPrice } from "./Functions";
import { useLogin } from "./contexts/AuthContext";
import { showNotification } from "@mantine/notifications";

export default function Payement({ patientId }) {
  const token = useLogin().token;
  const updateAppointments = useUpdatePatients();
  const [opened, setOpened] = useState(false);
  const appointments = usePatients().appointments;
  const appointmentTypes = useConfig().appointmentTypes;
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState("");

  const myAppointments = appointments.reduce(
    (acc, item) =>
      item.patientId !== patientId || item.payed !== 0
        ? acc
        : acc.concat({
            id: item.id,
            defaultValue: item.price,
            value:
              appointmentTypes.find((e) => e.id === item.idType)?.type +
              " " +
              displayDateInFrench(new Date(item.start)),
          }),
    []
  );
  const packages = useConfig().packages;
  const others = [{ value: "Autre", defaultValue: "", type: "other" }];
  const reasonOptions = others.concat(
    packages
      .map((e) => {
        return { value: e.package, defaultValue: e.price, type: "package" };
      })
      .concat(
        myAppointments.map((e) => {
          return {
            value: e.value,
            defaultValue: e.defaultValue,
            type: "appointment",
          };
        })
      )
  );

  const reasonOptionsList = reasonOptions.map((e) => e.value);

  const initialValues = {
    price: "",
    method: "",
  };

  const form = useForm({
    initialValues: initialValues,
  });

  function submitForm(values) {
    setLoading("loading");
    // there's going to be 3 cases
    // either it's an independant payement "other", in which case we just add it
    // or it's in relation to an appointment, in which case we need to link them together
    // finally if it's in relation to a package, we also need to create a new subscription
    var option = reasonOptions.find((e) => e.value === reason);
    switch (option?.type) {
      case "other":
        addNewPayement(0, values.method, values.price);
        break;
      case "appointment":
        // we need to find the event id to link it to the payement
        var eventId = myAppointments.find((e) => e.value === reason).id;
        addNewPayement(eventId, values.method, values.price);
        break;
      case "package":
        // we need to find the packageId to link it to the payement
        var packageId = packages.find((e) => e.package === reason).id;
        addNewSubscription(packageId, values.method, values.price);
        break;
      default:
        break;
    }
  }

  async function addNewPayement(eventId, method, price) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/AddNewPayement",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            eventId: eventId,
            method: method,
            amount: price * 100,
            patientId: patientId,
          }),
        }
      );
      const res = await fetchResponse.json();

      if (res.success) {
        showNotification({
          title: "Paiement effectué",
          message: `Le paiement de ${displayPrice(
            price * 100
          )} en ${method} a bien été enregistré.`,
          icon: <Check />,
          color: "green",
        });
        updateAppointments(token);
        setLoading("");
      }
    } catch (e) {
      return e;
    }
  }

  async function addNewSubscription(packageId, method, price) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/AddNewSubscription",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            packageId: packageId,
            method: method,
            amount: price * 100,
            patientId: patientId,
          }),
        }
      );
      const res = await fetchResponse.json();

      if (res.success) {
        showNotification({
          title: "Paiement effectué",
          message: `Le paiement de ${displayPrice(
            price * 100
          )} en ${method} a bien été enregistré.`,
          icon: <Check />,
          color: "green",
        });
        updateAppointments(token);
        setLoading("");
      }
    } catch (e) {
      return e;
    }
  }

  function handleReasonChange(value) {
    setReason(value);
    form.setFieldValue(
      "price",
      reasonOptions.find((e) => e.value === value)?.defaultValue / 100
    );
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
              data={reasonOptionsList}
              label="Motif du paiement"
              name="reason"
              searchable
              limit={5}
              value={reason}
              onChange={handleReasonChange}
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
                loading={loading}
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
