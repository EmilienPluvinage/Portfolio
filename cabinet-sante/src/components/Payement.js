import { useState } from "react";
import "../styles/styles.css";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { useConfig } from "./contexts/ConfigContext";
import { Calendar, Check, CurrencyEuro } from "tabler-icons-react";

import {
  Button,
  Center,
  Modal,
  NumberInput,
  Select,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { displayDateInFrench, displayPrice } from "./Functions";
import { useLogin } from "./contexts/AuthContext";
import { showNotification } from "@mantine/notifications";
import { DatePicker } from "@mantine/dates";
import { useEffect } from "react";

export default function Payement({ patientId, payementId }) {
  const token = useLogin().token;
  const updateAppointments = useUpdatePatients().update;
  const [opened, setOpened] = useState(false);
  const appointments = usePatients().appointments;
  const appointmentTypes = useConfig().appointmentTypes;
  const payements = usePatients().payements;
  const payement = payements.find((e) => e.id === payementId);
  const payementMethods = useConfig().parameters.reduce(
    (acc, item) =>
      item.name === "payementMethod" ? acc.concat(item.value) : acc,
    []
  );
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState("");

  const myAppointments = appointments.reduce(
    (acc, item) =>
      item.patientId !== patientId
        ? acc
        : acc.concat({
            payed: item.payed,
            id: item.id,
            defaultValue: item.price,
            defaultDate: item.start,
            value:
              appointmentTypes.find((e) => e.id === item.idType)?.type +
              " " +
              displayDateInFrench(new Date(item.start)),
          }),
    []
  );
  const packages = useConfig().packages;
  const others = [
    { value: "Autre", defaultValue: "", type: "other", payed: 0 },
  ];
  const reasonOptions = others.concat(
    packages
      .map((e) => {
        return {
          payed: 0,
          value: e.package,
          defaultValue: e.price,
          type: "package",
          packageId: e.id,
        };
      })
      .concat(
        myAppointments.map((e) => {
          return {
            payed: e.payed,
            appointmentId: e.id,
            value: e.value,
            defaultValue: e.defaultValue,
            defaultDate: e.defaultDate,
            type: "appointment",
          };
        })
      )
  );

  var reasonOptionsList = reasonOptions.filter((e) => e.payed === 0);
  reasonOptionsList = reasonOptionsList.map((e) => e.value);

  const initialValues = {
    price: "",
    method: "",
    date: "",
  };

  const form = useForm({
    initialValues: initialValues,
  });
  // fills the form on update
  useEffect(() => {
    if (
      opened === true &&
      payementId !== 0 &&
      form.values.price === "" &&
      form.values.method === "" &&
      form.values.date === "" &&
      reason === ""
    ) {
      form.setValues({
        price: payement?.amount / 100,
        method: payement?.method,
        date: new Date(payement?.date),
      });
      console.log(payement);
      if (
        payement.eventId === 0 ||
        payement.eventId === undefined ||
        payement.eventId === null
      ) {
        // then it's a package

        setReason(
          reasonOptions.find((e) => e.packageId === payement.packageId)?.value
        );
      } else {
        // then it's an appointment

        setReason(
          reasonOptions.find((e) => e.appointmentId === payement.eventId)?.value
        );
      }
    }
  }, [opened, form, reason, payementId, payement, reasonOptions]);

  // empties the form when window is closed
  useEffect(() => {
    if (
      opened === false &&
      (form.values.price !== "" ||
        form.values.method !== "" ||
        form.values.date !== "" ||
        reason !== "")
    ) {
      form.reset();
      setReason("");
    }
  }, [opened, form, reason]);

  function submitForm(values) {
    setLoading("loading");
    // there's going to be 3 cases
    // either it's an independant payement "other", in which case we just add it
    // or it's in relation to an appointment, in which case we need to link them together
    // finally if it's in relation to a package, we also need to create a new subscription
    var option = reasonOptions.find((e) => e.value === reason);
    switch (option?.type) {
      case "other":
        addNewPayement(0, values.method, values.price, values.date);
        break;
      case "appointment":
        // we need to find the event id to link it to the payement
        var eventId = myAppointments.find((e) => e.value === reason).id;
        addNewPayement(eventId, values.method, values.price, values.date);
        break;
      case "package":
        // we need to find the packageId to link it to the payement
        var packageId = packages.find((e) => e.package === reason).id;
        addNewSubscription(packageId, values.method, values.price, values.date);
        break;
      default:
        break;
    }
  }

  async function addNewPayement(eventId, method, price, date) {
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
            data: date,
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

        form.reset();
        setReason("");
        updateAppointments(token);
        setLoading("");
        setOpened(false);
      }
    } catch (e) {
      return e;
    }
  }

  async function addNewSubscription(packageId, method, price, date) {
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
            date: date,
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

        form.reset();
        setReason("");
        updateAppointments(token);
        setLoading("");
        setOpened(false);
      }
    } catch (e) {
      return e;
    }
  }

  function handleReasonChange(value) {
    setReason(value);
    if (reasonOptions.find((e) => e.value === value)?.type === "package") {
      form.setFieldValue("date", new Date(Date.now()));
    }
    if (reasonOptions.find((e) => e.value === value)?.type === "appointment") {
      form.setFieldValue(
        "date",
        new Date(reasonOptions.find((e) => e.value === value)?.defaultDate)
      );
    }
    form.setFieldValue(
      "price",
      reasonOptions.find((e) => e.value === value)?.defaultValue / 100
    );
  }

  async function updatePayement(values) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/updatePayement",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            id: payementId,
            method: values.method,
            amount: values.price * 100,
            date: new Date(values.date),
            patientId: patientId,
          }),
        }
      );
      const res = await fetchResponse.json();

      if (res.success) {
        showNotification({
          title: "Paiement Modifié",
          message: `Le paiement de ${displayPrice(values.price * 100)} en ${
            values.method
          } a bien été modifié.`,
          icon: <Check />,
          color: "green",
        });

        form.reset();
        setReason("");
        updateAppointments(token);
        setLoading("");
        setOpened(false);
      }
    } catch (e) {
      return e;
    }
  }

  return (
    <>
      {opened && (
        <Modal
          centered
          overlayOpacity={0.3}
          opened={opened}
          onClose={() => setOpened(false)}
          title={payementId === 0 ? "Nouveau paiement" : "Modifier paiement"}
          closeOnClickOutside={false}
        >
          <form
            id="payement"
            onSubmit={form.onSubmit((values) => submitForm(values))}
          >
            {payementId === 0 ? (
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
            ) : (
              <Text size={"sm"}>Motif: {reason}</Text>
            )}
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
              data={payementMethods}
              label="Moyen de paiement"
              name="method"
              {...form.getInputProps("method")}
              required
            />
            <DatePicker
              label="Date du paiement"
              locale="fr"
              name="date"
              {...form.getInputProps("date")}
              inputFormat="DD/MM/YYYY"
              placeholder="Date du paiement"
              icon={<Calendar size={16} />}
              required
            />
            <Center>
              {payementId === 0 ? (
                <Button
                  loading={loading}
                  form="payement"
                  onClick={form.onSubmit((values) => submitForm(values))}
                  style={{ marginTop: "20px" }}
                >
                  Encaisser
                </Button>
              ) : (
                <Button
                  loading={loading}
                  form="payement"
                  onClick={form.onSubmit((values) => updatePayement(values))}
                  style={{ marginTop: "20px" }}
                >
                  Modifier
                </Button>
              )}
            </Center>
          </form>
        </Modal>
      )}
      {payementId === 0 ? (
        <Button
          onClick={() => setOpened(true)}
          leftIcon={<CurrencyEuro size={18} />}
          style={{ margin: "10px" }}
        >
          Paiement
        </Button>
      ) : (
        <Button size="xs" variant="default" onClick={() => setOpened(true)}>
          {" "}
          {displayPrice(payement.amount)} €
        </Button>
      )}
    </>
  );
}
