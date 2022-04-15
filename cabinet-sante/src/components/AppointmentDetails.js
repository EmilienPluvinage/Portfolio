import React from "react";
import { usePatients } from "./contexts/PatientsContext";
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
} from "./Functions";
import { Calendar, Check, Trash, Pencil } from "tabler-icons-react";
import { useForm } from "@mantine/form";

export default function AppointmentDetails({
  setOpened,
  patientId, // to be used to pre-fill patient input when appointmentId === 0
  appointmentId,
}) {
  const patients = usePatients();
  const token = useLogin().token;
  const [loading, setLoading] = useState("");
  const [deleteLoader, setDeleteLoader] = useState("");
  const [EVAbefore, setEVAbefore] = useState(0);
  const [EVAafter, setEVAafter] = useState(0);

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
  };

  const form = useForm({
    initialValues: initialValues,
  });

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
    console.log(values);
    setLoading("loading");
    var link = process.env.REACT_APP_API_DOMAIN + "/NewEvent";
    const start = concatenateDateTime(values.date, values.timeRange[0]);
    const end = concatenateDateTime(values.date, values.timeRange[1]);
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
              patientId: patientId,
              appointmentId: eventId,
              token: token,
              size: values.size,
              weight: values.weight,
              EVAbefore: EVAbefore,
              EVAafter: EVAafter,
              reasonDetails: values.reasonDetails,
              patientType: values.patientType,
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
              getFullnameFromId(patients, patientId) +
              " a bien été enregistré.",
            icon: <Check />,
            color: "green",
          });
        }
      }
    } catch (e) {
      return e;
    }
  }

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => submitForm(values))}
        autoComplete="new-password"
      >
        <Text size="sm">Patient: {getFullnameFromId(patients, patientId)}</Text>

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
              data={["Adulte", "Femme enceinte", "Enfant", "Nourrisson"]}
              name="patientType"
              label="Profil du patient"
              {...form.getInputProps("patientType")}
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
            style={{ marginTop: "10px", marginRight: "70px" }}
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
                Modifier
              </Button>
            </Grid.Col>
          </Grid>
        )}
      </form>
    </>
  );
}
