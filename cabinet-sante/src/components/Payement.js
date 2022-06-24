import { useState } from "react";
import "../styles/styles.css";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { useConfig } from "./contexts/ConfigContext";
import { Calendar, Check, CurrencyEuro } from "tabler-icons-react";
import dayjs from "dayjs";
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
import Confirmation from "./Confirmation";

export default function Payement({
  patientId,
  payementId,
  eventId,
  subscriptionId,
  missed,
}) {
  const startOfMonth = dayjs(new Date()).startOf("month").toDate();
  const endOfPreviousMonth = dayjs(startOfMonth).subtract(1, "days").toDate();
  const token = useLogin().token;
  const updateAppointments = useUpdatePatients().update;
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState({
    text: "",
    title: "",
    callback: undefined,
  });
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
    // there's going to be 3 cases
    // either it's an independant payement "other", in which case we just add it
    // or it's in relation to an appointment, in which case we need to link them together
    // finally if it's in relation to a package, we also need to create a new subscription

    function handleValues(values) {
      setLoading("loading");
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
          addNewSubscription(
            packageId,
            values.method,
            values.price,
            values.date
          );
          break;
        default:
          break;
      }
    }

    if (new Date(values?.date) <= endOfPreviousMonth) {
      // we want to ask confirmation to the user because maybe they've already declared their income for last month
      setConfirmation({
        title: "Mois précédent",
        text: "Ce paiement concerne le mois précédent. Si jamais vous avez déjà déclaré votre chiffre d'affaire, il faudra modifier votre déclaration. Voulez-vous poursuivre l'opération?",
        callback: () => handleValues(values),
      });
      setOpen(true);
    } else {
      handleValues(values);
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
            date: dayjs(date).add(12, "hours").toDate(),
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
            date: dayjs(date).add(12, "hours").toDate(),
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
    async function handleValues(values) {
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
              date: dayjs(values.date).add(12, "hours").toDate(),
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

    if (new Date(values?.date) <= endOfPreviousMonth) {
      // we want to ask confirmation to the user because maybe they've already declared their income for last month
      setConfirmation({
        title: "Mois précédent",
        text: "Ce paiement concerne le mois précédent. Si jamais vous avez déjà déclaré votre chiffre d'affaire, il faudra modifier votre déclaration. Voulez-vous poursuivre l'opération?",
        callback: () => handleValues(values),
      });
      setOpen(true);
    } else {
      handleValues(values);
    }
  }

  async function deletePayement() {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/DeletePayement",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            id: payementId,
            patientId: patientId,
          }),
        }
      );
      const res = await fetchResponse.json();

      if (res.success) {
        // either it's an event, and we need to switch it to payed = 0, or it's a subscription and we need to remove it completely
        var success = true;
        if (eventId !== 0) {
          // it's an event
          const fetchResponse = await fetch(
            process.env.REACT_APP_API_DOMAIN + "/UpdatePayed",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: token,
                id: eventId,
                payed: 0,
                missed: missed,
                patientId: patientId,
              }),
            }
          );
          const res2 = await fetchResponse.json();
          if (!res2.success) {
            success = false;
          }
        } else {
          // it's a subscription
          const fetchResponse = await fetch(
            process.env.REACT_APP_API_DOMAIN + "/DeleteSubscription",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: token,
                id: subscriptionId,
                patientId: patientId,
              }),
            }
          );
          const res2 = await fetchResponse.json();
          if (!res2.success) {
            success = false;
          }
        }

        if (success) {
          showNotification({
            title: "Paiement Supprimé",
            message: `Le paiement a bien été supprimé.`,
            icon: <Check />,
            color: "green",
          });

          form.reset();
          setReason("");
          updateAppointments(token);
          setOpened(false);
        }
      }
    } catch (e) {
      return e;
    }
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

            {payementId === 0 ? (
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
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  onClick={deletePayement}
                  variant="outline"
                  color="red"
                  style={{
                    marginTop: "20px",

                    marginRight: "auto",
                  }}
                >
                  Supprimer
                </Button>
                <Button
                  loading={loading}
                  form="payement"
                  onClick={form.onSubmit((values) => updatePayement(values))}
                  style={{
                    marginTop: "20px",

                    marginLeft: "auto",
                  }}
                >
                  Modifier
                </Button>
              </div>
            )}
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
          {displayPrice(payement?.amount)} €
        </Button>
      )}
    </>
  );
}
