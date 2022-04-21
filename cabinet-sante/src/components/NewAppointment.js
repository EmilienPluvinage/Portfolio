import React from "react";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import {
  TextInput,
  Textarea,
  Button,
  MultiSelect,
  Grid,
  Modal,
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
  capitalize,
  splitname,
  setAutomaticPrice,
} from "./Functions";
import {
  Calendar,
  Check,
  Trash,
  Pencil,
  UserPlus,
  ListDetails,
  Clock,
  X,
} from "tabler-icons-react";
import { useForm } from "@mantine/form";
import AppointmentDetails from "./AppointmentDetails";
import { useConfig } from "./contexts/ConfigContext";
import { useEffect } from "react";

export default function NewAppointment({
  setOpened,
  patientId, // to be used to pre-fill patient input when appointmentId === 0
  startingTime,
  appointmentId,
}) {
  const patients = usePatients().patients;
  const updatePatients = useUpdatePatients();
  const patientsList = patients.map((e) => {
    return e.fullname;
  });
  const [data, setData] = useState(patientsList);
  const appointmentTypes = useConfig().appointmentTypes;
  const priceScheme = useConfig().priceScheme;
  const typesList = appointmentTypes.map((e) => {
    return e.type;
  });
  const token = useLogin().token;
  const [loading, setLoading] = useState("");
  const [deleteLoader, setDeleteLoader] = useState("");
  const [openedDetails, setOpenedDetails] = useState(false);
  const [appointment, setAppointment] = useState(appointmentId);
  const [id, setId] = useState(0);

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
    appointmentType: "",
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
            // const row = res.data[0];
            setId(appointmentId);
            const row = res.data[0];
            const patientsList = res.data.map((e) =>
              getFullnameFromId(patients, e.patientId)
            );
            form.setValues({
              patients: patientsList,
              title: row.title,
              date: dateOnly(row.start),
              timeRange: [timeOnly(row.start), timeOnly(row.end)],
              important: row.important,
              comments: row.comments,
              appointmentType: appointmentTypes.find((e) => e.id === row.idType)
                .type,
            });
          }
        } catch (e) {
          return e;
        }
      }
      getData();
    }
  }, [appointmentId, id, token, form, appointmentTypes, patientId, patients]);

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

  async function addEvent(values) {
    const check = checkValues(values);
    if (!check.check) {
      return { success: false, message: check.message };
    }
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
        var success = true;
        var eventId = res.id;
        // Now that the event has been created, we need to add all the participants
        async function addPatients() {
          values.patients.forEach(async (element) => {
            // first we check if this is a new patient, as in : is it already in the patients list:
            var patientId = 0;
            var index = patientsList.findIndex((e) => e === element);

            if (index === -1) {
              // it's a new patient
              patientId = await newPatient(element);
              // we also need to update the context
              await updatePatients(token);
            } else {
              // it's not, so we get the id of the existing one.
              patientId = getIdFromFullname(patients, element);
            }

            var packageId = patients.find((e) => e.id === patientId)?.packageId;

            packageId =
              packageId === null || packageId === undefined ? 0 : packageId;

            var price = setAutomaticPrice(
              priceScheme,
              0,
              appointmentTypeId,
              packageId
            );

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
                  price: price,
                  priceSetByUser: false,
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

  async function UpdateEvent(values) {
    const check = checkValues(values);
    if (!check.check) {
      return { success: false, message: check.message };
    }
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
          important: values.important,
          start: start,
          end: end,
          title: values.title,
          comments: values.comments,
          idType: appointmentTypeId,
          appointmentId: id,
          token: token,
        }),
      });
      const res = await fetchResponse.json();
      if (res.success) {
        var success = true;

        // Now that the event has been updated, we need to update all the participants,
        // Easy solution for now : delete all the participants and re-add them.
        // We'll see later if this creates any issue in which case we'll go through all of them one by one
        try {
          const fetchResponse = await fetch(
            process.env.REACT_APP_API_DOMAIN + "/DeleteAllParticipants",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                appointmentId: id,
                token: token,
              }),
            }
          );
          const resClear = await fetchResponse.json();
          if (resClear.success) {
            async function addPatients() {
              values.patients.forEach(async (element) => {
                var patientId = getIdFromFullname(patients, element);
                var packageId = patients.find(
                  (e) => e.id === patientId
                )?.packageId;

                packageId =
                  packageId === null || packageId === undefined ? 0 : packageId;

                var price = setAutomaticPrice(
                  priceScheme,
                  0,
                  appointmentTypeId,
                  packageId
                );
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
                      appointmentId: id,
                      size: 0,
                      weight: 0,
                      EVAbefore: 0,
                      EVAafter: 0,
                      reasonDetails: "",
                      patientType: "",
                      token: token,
                      price: price,
                      priceSetByUser: false,
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
            return { success: success, eventId: id };
          }
        } catch (e) {
          return e;
        }
      }
    } catch (e) {
      return e;
    }
  }

  async function newPatient(fullname) {
    const name = splitname(fullname);

    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/NewPatientSimplified",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname: capitalize(name.firstname),
            lastname: capitalize(name.lastname),
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        return res.id;
      }
    } catch (e) {
      return e;
    }
  }

  function checkValues(values) {
    if (values.appointmentType === "") {
      return {
        check: false,
        message: "Merci de sélectionner le type de consultation.",
      };
    }
    const appointmentTypeMulti = appointmentTypes.find(
      (e) => e.type === values.appointmentType
    ).multi;

    if (values.patients.length === 0) {
      return {
        check: false,
        message: "Merci de sélectionner au moins un patient.",
      };
    }

    if (appointmentTypeMulti === 0 && values.patients.length > 1) {
      return {
        check: false,
        message:
          "Ce type de consultation ne permet pas d'avoir plusieurs patients en même temps.",
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

  async function submitForm(values) {
    setLoading("loading");
    const result =
      id === 0 ? await addEvent(values) : await UpdateEvent(values);
    if (result.success) {
      const start = concatenateDateTime(values.date, values.timeRange[0]);
      setOpened(false);
      showNotification({
        title: id === 0 ? "Consultation planifiée" : "Consultation modifiée",
        message:
          "Le rendez-vous du " +
          displayDateInFrench(new Date(start)) +
          " a bien été enregistré avec " +
          values.patients.length +
          " participant(s).",
        icon: <Check />,
        color: "green",
      });
    } else {
      setLoading("");
      showNotification({
        title: "Consultation non-planifiée",
        message: result.message,
        icon: <X />,
        color: "red",
      });
    }
  }

  async function openDetails() {
    setDeleteLoader("loading");
    const result = await addEvent(form.values);
    if (result.success) {
      setAppointment(result.eventId);
      setOpenedDetails(true);
    } else {
      setDeleteLoader("");
      showNotification({
        title: "Consultation non-planifiée",
        message: result.message,
        icon: <X />,
        color: "red",
      });
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
          data={data}
          label="Patient(s)"
          placeholder="Ajouter"
          searchable
          creatable
          getCreateLabel={(query) => `Ajouter ${query}`}
          onCreate={(query) => setData((current) => [...current, query])}
          limit={5}
          maxDropdownHeight={160}
          {...form.getInputProps("patients")}
        />
        <Grid grow>
          <Grid.Col span={2}>
            {" "}
            <TextInput
              style={{ marginTop: "8px" }}
              label="Titre"
              name="title"
              {...form.getInputProps("title")}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Grid.Col span={2}>
              <Select
                data={typesList}
                name="appointmentType"
                label="Type de consultation"
                {...form.getInputProps("appointmentType")}
                required
              />
            </Grid.Col>
          </Grid.Col>
        </Grid>

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
