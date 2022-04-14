import React from "react";
import { usePatients } from "./contexts/PatientsContext";
import {
  TextInput,
  Textarea,
  Button,
  Center,
  MultiSelect,
  Grid,
  Accordion,
  Text,
  NumberInput,
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
  dateOnly,
  timeOnly,
  getFullnameFromId,
  getIdFromFullname,
} from "./Functions";
import { Calendar, Check, Trash, Pencil, UserPlus } from "tabler-icons-react";
import { useForm } from "@mantine/form";

export default function NewAppointment({
  setOpened,
  patientId, // to be used to pre-fill patient input when appointmentId === 0
  startingTime,
  appointmentId,
}) {
  const patients = usePatients();
  const patientsList = patients.map((e) => {
    return e.fullname;
  });
  const token = useLogin().token;
  const [loading, setLoading] = useState("");
  const [deleteLoader, setDeleteLoader] = useState("");

  const now = new Date(
    startingTime === 0 ? Date.now() : timeOnly(startingTime)
  );
  const then = dayjs(now).add(60, "minutes").toDate();
  const date = new Date(
    startingTime === 0 ? Date.now() : dateOnly(startingTime)
  );

  const initialValues = {
    patients: patientId === 0 ? [] : [getFullnameFromId(patients, patientId)],
    title: "",
    date: date,
    timeRange: [now, then],
    important: "",
    comments: "",
    size: 0,
    weight: 0,
    patientType: "",
  };

  const form = useForm({
    initialValues: initialValues,
  });

  async function deleteAppointment() {
    // to rewrite probably
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
        var success = true;
        var eventId = res.id;
        // Now that the event has been created, we need to add all the participants
        async function addPatients() {
          values.patients.forEach(async (element) => {
            var patientId = getIdFromFullname(patients, element);
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
                }),
              }
            );
            const res = await fetchResponse.json();
            if (res.success === false) {
              success = false;
            }
          });
        }
        await addPatients();
        if (success) {
          setOpened(false);
          showNotification({
            title: "Consultation planifiée",
            message:
              "Le rendez-vous du " +
              displayDateInFrench(new Date(start)) +
              " a bien été enregistré avec " +
              values.patients.length +
              " participant(s).",
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
        <MultiSelect
          dropdownPosition="top"
          name="patients"
          icon={<UserPlus size={16} />}
          data={patientsList}
          label="Patient(s)"
          placeholder="Ajouter"
          searchable
          limit={5}
          nothingFound="Aucune option disponible"
          maxDropdownHeight={160}
          {...form.getInputProps("patients")}
        />

        <TextInput
          label="Titre"
          name="title"
          {...form.getInputProps("title")}
        />
        <Grid grow>
          <Grid.Col span={2}>
            <DatePicker
              label="Jour de la consultation"
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
              label="Heure de la consultation"
              name="timeRange"
              {...form.getInputProps("timeRange")}
              required
            />
          </Grid.Col>
        </Grid>
        <Accordion iconPosition="right" iconSize={22} offsetIcon={false}>
          <Accordion.Item label="Détails de la consultation">
            {form.values.patients.length <= 1 ? (
              <>
                <Grid grow>
                  <Grid.Col span={3}>
                    <NumberInput
                      name="size"
                      label="Taille (en cm):"
                      {...form.getInputProps("size")}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <NumberInput
                      name="weight"
                      label="Poids (en kg:"
                      {...form.getInputProps("weight")}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Select
                      data={[
                        "Adulte",
                        "Femme enceinte",
                        "Enfant",
                        "Nourrisson",
                      ]}
                      name="patientType"
                      label="Profil du patient"
                      {...form.getInputProps("patientType")}
                    />
                  </Grid.Col>
                </Grid>
              </>
            ) : (
              <Text size={"sm"}>
                Cette options n'est disponible uniquement pour les rendez-vous
                avez une seule personne et permets de fournir des informations
                complémentaires (Taille, poids, symptômes, etc...). Pour les
                rendez-vous multi-patients, il est préférable d'utiliser la case
                "Commentaires" ci-dessous.
              </Text>
            )}
          </Accordion.Item>
        </Accordion>
        <Textarea
          label="Commentaires"
          name="comments"
          {...form.getInputProps("comments")}
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
