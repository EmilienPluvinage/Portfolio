import React from "react";
import { usePatients } from "./contexts/PatientsContext";
import {
  TextInput,
  Textarea,
  Button,
  MultiSelect,
  Grid,
  Modal,
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
import {
  Calendar,
  Check,
  Trash,
  Pencil,
  UserPlus,
  ListDetails,
  Clock,
} from "tabler-icons-react";
import { useForm } from "@mantine/form";
import AppointmentDetails from "./AppointmentDetails";

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
  const [openedDetails, setOpenedDetails] = useState(false);
  const [appointment, setAppointment] = useState(appointmentId);

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

  async function addEvent(values) {
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
                  size: 0,
                  weight: 0,
                  EVAbefore: 0,
                  EVAafter: 0,
                  reasonDetails: "",
                  patientType: "",
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
        return { success: success, eventId: eventId };
      }
    } catch (e) {
      return e;
    }
  }

  async function submitForm(values) {
    const start = concatenateDateTime(values.date, values.timeRange[0]);
    setLoading("loading");
    const result = await addEvent(values);
    if (result.success) {
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

  async function openDetails() {
    setDeleteLoader("loading");
    const result = await addEvent(form.values);
    if (result.success) {
      setAppointment(result.eventId);
      setOpenedDetails(true);
    }
  }

  return (
    <>
      <Modal
        centered
        overlayOpacity={0.3}
        opened={openedDetails}
        onClose={() => {
          setOpenedDetails(false);
          setOpened(false);
        }}
        title={"Consultation"}
        closeOnClickOutside={false}
        size="50%"
      >
        {openedDetails && (
          <AppointmentDetails
            setOpened={setOpened}
            patientId={0}
            appointmentId={appointment}
          />
        )}
      </Modal>
      <form
        onSubmit={form.onSubmit((values) => submitForm(values))}
        autoComplete="new-password"
      >
        <MultiSelect
          required
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

        <Textarea
          label="Commentaires"
          name="comments"
          {...form.getInputProps("comments")}
        />

        {appointmentId === 0 ? (
          <Grid
            justify="space-between"
            style={{ marginTop: "10px", marginRight: "70px" }}
          >
            <Grid.Col span={2}>
              {form?.values?.patients?.length <= 1 && (
                <Button
                  leftIcon={<ListDetails size={18} />}
                  onClick={openDetails}
                  loading={deleteLoader}
                >
                  Détails
                </Button>
              )}
            </Grid.Col>
            <Grid.Col span={2}>
              <Button
                leftIcon={<Clock size={18} />}
                type="submit"
                loading={loading}
              >
                Planifier
              </Button>
            </Grid.Col>
          </Grid>
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
