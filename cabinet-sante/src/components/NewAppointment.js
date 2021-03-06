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
  displayPrice,
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
  ExclamationMark,
} from "tabler-icons-react";
import { useForm } from "@mantine/form";
import AppointmentDetails from "./AppointmentDetails";
import DuplicateEvent from "./DuplicateEvent";
import { useConfig } from "./contexts/ConfigContext";
import { useEffect } from "react";

export default function NewAppointment({
  setOpened,
  patientId, // to be used to pre-fill patient input when appointmentId === 0
  startingTime,
  appointmentId,
}) {
  const now = new Date(
    startingTime === 0 ? Date.now() : timeOnly(startingTime)
  );
  const then = dayjs(now).add(60, "minutes").toDate();
  const date = new Date(
    startingTime === 0 ? Date.now() : dateOnly(startingTime)
  );

  const appointments = usePatients().appointments;
  const missedAppointments = usePatients().missedAppointments;
  const patients = usePatients().patients;
  const updatePatients = useUpdatePatients().update;
  const checkPrices = useUpdatePatients().check;
  const patientsList = patients
    .filter((e) => e.death === "" || new Date(e.death) >= date)
    .map((e) => {
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

  const initialValues = {
    patients: patientId === 0 ? [] : [getFullnameFromId(patients, patientId)],
    absents: [],
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
      // then we get data from the context and update the form
      const thisAppointment = appointments.filter(
        (e) => e.appointmentId?.toString() === appointmentId?.toString()
      );
      const missedThisAppointment = missedAppointments.filter(
        (e) => e.appointmentId?.toString() === appointmentId?.toString()
      );
      setId(appointmentId);
      const row = thisAppointment[0];
      const patientsList = thisAppointment.map((e) =>
        getFullnameFromId(patients, e.patientId)
      );
      const missedPatients = missedThisAppointment.map((e) =>
        getFullnameFromId(patients, e.patientId)
      );
      form.setValues({
        patients: patientsList,
        absents: missedPatients,
        title: row.title,
        date: dateOnly(row.start),
        timeRange: [timeOnly(row.start), timeOnly(row.end)],
        important: row.important,
        comments: row.comments,
        appointmentType: appointmentTypes.find((e) => e.id === row.idType).type,
      });
    }
  }, [
    appointmentId,
    appointments,
    missedAppointments,
    appointmentTypes,
    form,
    id,
    patients,
  ]);

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
        await updatePatients(token);
        setDeleteLoader("");
        showNotification({
          title: "Consultation supprim??e",
          message: "Le rendez-vous a bien ??t?? supprim??.",
          icon: <Check />,
          color: "green",
        });
      }
    } catch (e) {
      return e;
    }
  }

  async function newParticipant(id, eventId, price, i) {
    const fetchResponse = await fetch(
      process.env.REACT_APP_API_DOMAIN + "/NewParticipant",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: id,
          appointmentId: eventId,
          size: 0,
          weight: 0,
          EVAbefore: 0,
          EVAafter: 0,
          reasonDetails: "",
          tests: "",
          treatment: "",
          remarks: "",
          drawing: "",
          patientType: 0,
          token: token,
          price: price,
          priceSetByUser: false,
          payed: 0,
        }),
      }
    );
    const res = await fetchResponse.json();
    return res.success;
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
          start: new Date(start),
          end: new Date(end),
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

        const findPackage = (x) => patients.find((e) => e.id === x)?.packageId;
        let returnPatientIds = [];
        let returnPrices = [];
        for (const element of values.patients) {
          // first we check if this is a new patient, as in : is it already in the patients list:
          var patientId = 0;
          var index = patientsList.findIndex((e) => e === element);

          if (index === -1) {
            // it's a new patient
            patientId = await newPatient(element);
          } else {
            // it's not, so we get the id of the existing one.
            patientId = getIdFromFullname(patients, element);
          }
          returnPatientIds.push(patientId);

          var packageId = findPackage(patientId);

          packageId =
            packageId === null || packageId === undefined ? 0 : packageId;

          var price = setAutomaticPrice(
            priceScheme,
            0,
            appointmentTypeId,
            packageId
          );

          returnPrices.push(price);
        }

        let queries = [];
        for (let i = 0; i < returnPatientIds.length; i++) {
          queries.push(
            newParticipant(returnPatientIds[i], eventId, returnPrices[i], i)
          );
        }

        await Promise.allSettled(queries);
        // then we add the patients who missed the appointment

        for (const element of values.absents) {
          patientId = getIdFromFullname(patients, element);

          packageId = findPackage(patientId);

          packageId =
            packageId === null || packageId === undefined ? 0 : packageId;

          price = setAutomaticPrice(
            priceScheme,
            0,
            appointmentTypeId,
            packageId
          );

          const fetchResponse = await fetch(
            process.env.REACT_APP_API_DOMAIN + "/NewAbsent",
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
                price: price,
                priceSetByUser: false,
              }),
            }
          );
          const res = await fetchResponse.json();
          if (res.success === false) {
            success = false;
          }
        }

        checkPrices();
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
          start: new Date(start),
          end: new Date(end),
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
            const findPackage = (x) =>
              patients.find((e) => e.id === x)?.packageId;

            const findPrice = (patientId, appointmentId, appointments) =>
              appointments.find(
                (e) =>
                  e.patientId?.toString() === patientId?.toString() &&
                  e.appointmentId?.toString() === appointmentId?.toString()
              )?.price;

            const findFullName = (x) =>
              patients.find((e) => e.id?.toString() === x?.toString())
                ?.fullname;

            async function addPatients() {
              let returnPatientIds = [];
              let returnPrices = [];
              for (const element of values.patients) {
                var patientId = getIdFromFullname(patients, element);
                var packageId = findPackage(patientId);
                returnPatientIds.push(patientId);

                packageId =
                  packageId === null || packageId === undefined ? 0 : packageId;
                var oldPrice = findPrice(
                  patientId,
                  appointmentId,
                  appointments
                );

                var price = setAutomaticPrice(
                  priceScheme,
                  0,
                  appointmentTypeId,
                  packageId
                );
                returnPrices.push(price);

                if (price !== oldPrice && oldPrice !== undefined) {
                  var patientName = findFullName(patientId);

                  showNotification({
                    title: "Prix modifi??",
                    message: `Le prix de la s??ance de ${patientName} est pass?? de ${displayPrice(
                      oldPrice
                    )} ??? ?? ${displayPrice(price)} ??? suite ?? la modification`,
                    icon: <ExclamationMark />,
                    color: "yellow",
                    autoClose: 10000,
                  });
                }
              }
              let queries = [];
              for (let i = 0; i < returnPatientIds.length; i++) {
                queries.push(
                  newParticipant(returnPatientIds[i], id, returnPrices[i], i)
                );
              }

              await Promise.allSettled(queries);
            }
            await addPatients();

            async function addMissedPatients() {
              for (const element of values.absents) {
                var patientId = getIdFromFullname(patients, element);
                var packageId = findPackage(patientId);

                packageId =
                  packageId === null || packageId === undefined ? 0 : packageId;
                var oldPrice = findPrice(
                  patientId,
                  appointmentId,
                  missedAppointments
                );

                var price = setAutomaticPrice(
                  priceScheme,
                  0,
                  appointmentTypeId,
                  packageId
                );
                const fetchResponse = await fetch(
                  process.env.REACT_APP_API_DOMAIN + "/NewAbsent",
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      patientId: patientId,
                      appointmentId: id,
                      token: token,
                      price: price,
                      priceSetByUser: false,
                    }),
                  }
                );
                const res = await fetchResponse.json();

                if (res.success === false) {
                  success = false;
                } else if (price !== oldPrice && oldPrice !== undefined) {
                  var patientName = findFullName(patientId);

                  showNotification({
                    title: "Prix modifi??",
                    message: `Le prix de la s??ance de ${patientName} est pass?? de ${displayPrice(
                      oldPrice
                    )} ??? ?? ${displayPrice(price)} ??? suite ?? la modification`,
                    icon: <ExclamationMark />,
                    color: "yellow",
                    autoClose: 10000,
                  });
                }
              }
            }
            await addMissedPatients();

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
    // we check if there's already a patient with the same fullname
    var index = patients.findIndex(
      (patient) => patient?.fullname?.toUpperCase() === fullname.toUpperCase()
    );
    if (index !== -1) {
      // it means there is already a patient with the same fullname, so we had a 2 and show a notification

      showNotification({
        title: "Nom identique",
        message: `Il existait d??j?? un patient avec le nom ${fullname}, le nouveau a donc ??t?? renomm?? en ${fullname}2, pensez ?? le renommer (en ajoutant par exemple un deuxi??me pr??nom).`,
        icon: <ExclamationMark />,
        color: "yellow",
      });
      fullname = fullname + "2";
    }

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
        message: "Merci de s??lectionner le type de consultation.",
      };
    }
    const appointmentTypeMulti = appointmentTypes.find(
      (e) => e.type === values.appointmentType
    ).multi;

    if (values.patients.length === 0) {
      return {
        check: false,
        message: "Merci de s??lectionner au moins un patient.",
      };
    }

    if (
      appointmentTypeMulti === 0 &&
      values.patients.length + values.absents.length > 1
    ) {
      return {
        check: false,
        message:
          "Ce type de consultation ne permet pas d'avoir plusieurs patients en m??me temps.",
      };
    }
    if (values.date === null || values.start === "" || values.end === "") {
      return {
        check: false,
        message:
          "Merci de s??lectionner une date, une heure de d??but et une heure de fin.",
      };
    }

    if (timeOnly(values.timeRange[0]) >= timeOnly(values.timeRange[1])) {
      return {
        check: false,
        message:
          "Merci de s??lectionner une heure de fin post??rieure ?? la date de d??but de rendez-vous.",
      };
    }

    for (const element of values.patients) {
      if (values.absents.find((e) => e === element)) {
        return {
          check: false,
          message:
            "Au moins un patient est ?? la fois absent et pr??sent. Merci de le retirer d'une des deux listes.",
        };
      }
    }

    return { check: true };
  }

  async function submitForm(values) {
    setLoading("loading");
    const result =
      id === 0 ? await addEvent(values) : await UpdateEvent(values);

    if (result.success) {
      const start = concatenateDateTime(values.date, values.timeRange[0]);

      showNotification({
        title: id === 0 ? "Consultation planifi??e" : "Consultation modifi??e",
        message:
          "Le rendez-vous du " +
          displayDateInFrench(new Date(start)) +
          " a bien ??t?? enregistr?? avec " +
          values.patients.length +
          " participant(s).",
        icon: <Check />,
        color: "green",
      });

      await updatePatients(token);
      setOpened(false);
    } else {
      setLoading("");
      showNotification({
        title: "Consultation non-planifi??e",
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
      await updatePatients(token);
      setAppointment(result.eventId);
      setOpenedDetails(true);
    } else {
      setDeleteLoader("");
      showNotification({
        title: "Consultation non-planifi??e",
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
        <MultiSelect
          required
          dropdownPosition="top"
          name="absents"
          icon={<UserPlus size={16} />}
          data={data}
          label="Absent(s) (injustifi??s)"
          placeholder="Ajouter"
          searchable
          limit={5}
          maxDropdownHeight={160}
          {...form.getInputProps("absents")}
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
              {form?.values?.patients?.length <= 1 &&
                appointmentTypes.find(
                  (e) => e.type === form?.values?.appointmentType
                )?.multi === 0 &&
                form?.values?.absents?.length === 0 && (
                  <Button
                    leftIcon={<ListDetails size={18} />}
                    onClick={openDetails}
                    loading={deleteLoader}
                  >
                    D??tails
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
                size="sm"
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
              <DuplicateEvent
                appointmentId={appointmentId}
                parentSetOpened={setOpened}
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <Button
                size="sm"
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
