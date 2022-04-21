import React from "react";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import {
  TextInput,
  Textarea,
  Button,
  Center,
  Grid,
  Text,
  NumberInput,
  Slider,
  Select,
} from "@mantine/core";
import { DatePicker, TimeRangeInput } from "@mantine/dates";
import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { useLogin } from "./contexts/AuthContext";
import { showNotification } from "@mantine/notifications";
import {
  concatenateDateTime,
  displayDateInFrench,
  getFullnameFromId,
  dateOnly,
  timeOnly,
  setAutomaticPrice,
} from "./Functions";
import { Calendar, Check, Trash, Pencil, X } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useConfig } from "./contexts/ConfigContext";

export default function AppointmentDetails({
  setOpened,
  patientId, // to be used to pre-fill patient input when appointmentId === 0
  appointmentId,
}) {
  const patients = usePatients().patients;
  const updateAppointments = useUpdatePatients();
  const token = useLogin().token;
  const [loading, setLoading] = useState("");
  const [deleteLoader, setDeleteLoader] = useState("");
  const [EVAbefore, setEVAbefore] = useState(0);
  const [EVAafter, setEVAafter] = useState(0);
  const [id, setId] = useState(0);
  const [patient, setPatient] = useState(patientId);
  const appointmentTypes = useConfig().appointmentTypes;
  const patientTypes = useConfig().patientTypes;
  const priceScheme = useConfig().priceScheme;
  const patientTypesList = patientTypes.map((e) => e.type);
  const appointmentTypesSolo = appointmentTypes.filter((e) => e.multi === 0);
  const typesList = appointmentTypesSolo.map((e) => {
    return e.type;
  });

  const now = new Date(Date.now());
  const then = dayjs(now).add(60, "minutes").toDate();
  const date = new Date(Date.now());

  const initialValues = {
    title: "",
    date: date,
    timeRange: [now, then],
    important: "",
    comments: "",
    size: 0,
    weight: 0,
    EVAafter: 0,
    reasonDetails: "",
    patientType: "",
    appointmentType: "",
    price: 0,
  };

  const form = useForm({
    initialValues: initialValues,
  });

  useEffect(() => {
    if (appointmentId !== 0 && id === 0) {
      // then we get data from the DB and update the from
      async function getData() {
        try {
          const fetchResponse = await fetch(
            process.env.REACT_APP_API_DOMAIN + "/GetEventDetails",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: appointmentId,
                token: token,
              }),
            }
          );
          const res = await fetchResponse.json();

          if (res.success) {
            const row = res.data[0];
            setPatient(row.patientId);
            var appointmentType = appointmentTypes.find(
              (e) => e.id === row.idType
            ).type;
            var patientType = patientTypes.find(
              (e) => e.id.toString() === row.patientType.toString()
            )?.type;
            setId(appointmentId);

            setEVAbefore(row.EVAbefore);
            setEVAafter(row.EVAafter);
            form.setValues({
              title: row.title,
              date: dateOnly(row.start),
              timeRange: [timeOnly(row.start), timeOnly(row.end)],
              important: row.important,
              comments: row.comments,
              size: row.size,
              weight: row.weight,
              reasonDetails: row.reasonDetails,
              patientType: patientType,
              appointmentType: appointmentType,
              price: row.price / 100,
            });
          }
        } catch (e) {
          return e;
        }
      }
      getData();
    }
  }, [appointmentId, id, token, form, appointmentTypes, patientTypes]);

  function checkValues(values) {
    if (values.appointmentType === "") {
      return {
        check: false,
        message: "Merci de sélectionner le type de consultation.",
      };
    }

    if (values.date === null || values.start === "" || values.end === "") {
      return {
        check: false,
        message:
          "Merci de sélectionner une date, une heure de début et une heure de fin.",
      };
    }

    if (timeOnly(values.timeRange[0]) >= timeOnly(values.timeRange[1])) {
      return {
        check: false,
        message:
          "Merci de sélectionner une heure de fin postérieure à la date de début de rendez-vous.",
      };
    }

    return { check: true };
  }

  async function deleteAppointment() {
    setDeleteLoader("loading");
    var link = process.env.REACT_APP_API_DOMAIN + "/DeleteEvent";
    try {
      const fetchResponse = await fetch(link, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: appointmentId,
          token: token,
        }),
      });
      const res = await fetchResponse.json();
      if (res.success) {
        setOpened(false);
        setDeleteLoader("");
        updateAppointments(token);
        showNotification({
          title: "Consultation supprimée",
          message: "Le rendez-vous a bien été supprimé.",
          icon: <Check />,
          color: "green",
        });
      }
    } catch (e) {
      return e;
    }
  }

  async function submitForm(values) {
    if (appointmentId === 0) {
      createEvent(values);
    } else {
      updateEvent(values);
    }
  }

  async function createEvent(values) {
    const check = checkValues(values);
    if (check.check) {
      setLoading("loading");
      var link = process.env.REACT_APP_API_DOMAIN + "/NewEvent";
      const start = concatenateDateTime(values.date, values.timeRange[0]);
      const end = concatenateDateTime(values.date, values.timeRange[1]);

      const appointmentTypeId = appointmentTypes.find(
        (e) => e.type === values.appointmentType
      ).id;
      try {
        const fetchResponse = await fetch(link, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            important: values.important,
            start: start,
            end: end,
            title: values.title,
            comments: values.comments,
            idType: appointmentTypeId,
            token: token,
          }),
        });
        const res = await fetchResponse.json();
        if (res.success) {
          var eventId = res.id;
          // Now that the event has been created, we need to add all the participants

          const fetchResponse = await fetch(
            process.env.REACT_APP_API_DOMAIN + "/NewParticipant",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                patientId: patient,
                appointmentId: eventId,
                token: token,
                size: values.size,
                weight: values.weight,
                EVAbefore: EVAbefore,
                EVAafter: EVAafter,
                reasonDetails: values.reasonDetails,
                patientType: patientTypes.find(
                  (e) => e.type === values.patientType
                )?.id,
                price: Math.round(values.price * 100),
                priceSetByUser: true,
              }),
            }
          );
          const res2 = await fetchResponse.json();
          if (res2.success) {
            setOpened(false);
            showNotification({
              title: "Consultation planifiée",
              message:
                "Le rendez-vous du " +
                displayDateInFrench(new Date(start)) +
                "  avec " +
                getFullnameFromId(patients, patient) +
                " a bien été enregistré.",
              icon: <Check />,
              color: "green",
            });
          }
        }
      } catch (e) {
        return e;
      }
    } else {
      showNotification({
        title: "Consultation non-planifiée",
        message: check.message,
        icon: <X />,
        color: "red",
      });
    }
  }

  async function updateEvent(values) {
    const check = checkValues(values);
    if (check.check) {
      setLoading("loading");
      var link = process.env.REACT_APP_API_DOMAIN + "/UpdateEvent";
      const start = concatenateDateTime(values.date, values.timeRange[0]);
      const end = concatenateDateTime(values.date, values.timeRange[1]);
      const appointmentTypeId = appointmentTypes.find(
        (e) => e.type === values.appointmentType
      ).id;
      try {
        const fetchResponse = await fetch(link, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appointmentId: id,
            important: values.important,
            start: start,
            end: end,
            title: values.title,
            comments: values.comments,
            idType: appointmentTypeId,
            token: token,
          }),
        });
        const res = await fetchResponse.json();
        if (res.success) {
          const fetchResponse = await fetch(
            process.env.REACT_APP_API_DOMAIN + "/UpdateParticipant",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                patientId: patient,
                appointmentId: id,
                token: token,
                size: values.size,
                weight: values.weight,
                EVAbefore: EVAbefore,
                EVAafter: EVAafter,
                reasonDetails: values.reasonDetails,
                patientType: patientTypes.find(
                  (e) => e.type === values.patientType
                )?.id,
                price: Math.round(values.price * 100),
                priceSetByUser: true,
              }),
            }
          );
          const res2 = await fetchResponse.json();
          if (res2.success) {
            setOpened(false);
            updateAppointments(token);
            showNotification({
              title: "Consultation Modifiée",
              message:
                "Le rendez-vous du " +
                displayDateInFrench(new Date(start)) +
                "  avec " +
                getFullnameFromId(patients, patient) +
                " a bien été modifié.",
              icon: <Check />,
              color: "green",
            });
          }
        }
      } catch (e) {
        return e;
      }
    } else {
      showNotification({
        title: "Consultation non-planifiée",
        message: check.message,
        icon: <X />,
        color: "red",
      });
    }
  }

  function handleChange(name, value) {
    form.setFieldValue(name, value);
    setPrice(name, value);
  }

  function setPrice(name, value) {
    var appointmentType =
      name === "appointmentType" ? value : form.values.appointmentType;
    var patientType = name === "patientType" ? value : form.values.patientType;
    var appointmentTypeId = appointmentTypes.find(
      (e) => e.type === appointmentType
    )?.id;
    var patientTypeId = patientTypes.find((e) => e.type === patientType)?.id;
    var packageId = patients.find((e) => e.id === patientId)?.packageId;

    packageId = packageId === null || packageId === undefined ? 0 : packageId;
    patientTypeId =
      patientTypeId === null || patientTypeId === undefined ? 0 : patientTypeId;
    appointmentTypeId =
      appointmentTypeId === null || appointmentTypeId === undefined
        ? 0
        : appointmentTypeId;

    form.setFieldValue(
      "price",
      setAutomaticPrice(
        priceScheme,
        patientTypeId,
        appointmentTypeId,
        packageId
      ) / 100
    );
  }
  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => submitForm(values))}
        autoComplete="new-password"
      >
        <Text size="sm">
          Patient: {patient !== 0 && getFullnameFromId(patients, patient)}
        </Text>
        <Grid>
          <Grid.Col span={4}>
            <Select
              style={{ width: "fit-content" }}
              data={typesList}
              name="appointmentType"
              label="Consultation"
              value={form.values.appointmentType}
              onChange={(value) => handleChange("appointmentType", value)}
              required
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              label="Prix"
              min={0}
              precision={2}
              step={0.01}
              {...form.getInputProps("price")}
              hideControls
            />
          </Grid.Col>
        </Grid>

        <Grid grow>
          <Grid.Col span={4}>
            <TextInput
              label="Titre"
              name="title"
              {...form.getInputProps("title")}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            <DatePicker
              label="Jour"
              locale="fr"
              name="date"
              {...form.getInputProps("date")}
              inputFormat="DD/MM/YYYY"
              placeholder="Choisissez une date"
              icon={<Calendar size={16} />}
              required
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <TimeRangeInput
              locale="fr"
              label="Heure"
              name="timeRange"
              {...form.getInputProps("timeRange")}
              required
            />
          </Grid.Col>
        </Grid>
        <Grid grow>
          <Grid.Col span={2}>
            <Select
              data={patientTypesList}
              name="patientType"
              label="Profil du patient"
              value={form.values.patientType}
              onChange={(value) => handleChange("patientType", value)}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              label="Taille en cm"
              name="size"
              {...form.getInputProps("size")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              label="Poids en kg"
              name="weight"
              {...form.getInputProps("weight")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <div>
              <Text size="xs">EVA Avant</Text>
              <Slider
                name="EVAbefore"
                min={0}
                max={10}
                step={1}
                value={EVAbefore}
                onChange={setEVAbefore}
              />
            </div>
            <div>
              <Text size="xs">EVA Après</Text>
              <Slider
                name="EVAafter"
                min={0}
                max={10}
                step={1}
                value={EVAafter}
                onChange={setEVAafter}
              />
            </div>
          </Grid.Col>
        </Grid>
        <Textarea
          label="Motif de consultation"
          name="reasonDetails"
          {...form.getInputProps("reasonDetails")}
        />

        {appointmentId === 0 ? (
          <Center>
            <Button
              type="submit"
              style={{ marginTop: "10px" }}
              loading={loading}
            >
              Planifier
            </Button>
          </Center>
        ) : (
          <Grid
            justify="space-between"
            style={{ marginTop: "10px", marginRight: "45px" }}
          >
            <Grid.Col span={2}>
              <Button
                leftIcon={<Trash size={18} />}
                variant="outline"
                color="red"
                onClick={deleteAppointment}
                loading={deleteLoader}
              >
                Supprimer
              </Button>
            </Grid.Col>
            <Grid.Col span={2}>
              <Button
                type="submit"
                leftIcon={<Pencil size={18} />}
                loading={loading}
              >
                Enregistrer
              </Button>
            </Grid.Col>
          </Grid>
        )}
      </form>
    </>
  );
}
