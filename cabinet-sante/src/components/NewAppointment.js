import React from "react";
import {
  TextInput,
  Textarea,
  Select,
  Button,
  Center,
  Autocomplete,
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
} from "./Functions";
import { Calendar } from "tabler-icons-react";

export default function NewAppointment({ setOpened, patientId, startingTime }) {
  const [patient, setPatient] = useState("");
  const [id, setId] = useState(patientId);
  const now = new Date(
    startingTime === 0 ? Date.now() : timeOnly(startingTime)
  );
  const then = dayjs(now).add(60, "minutes").toDate();
  const token = useLogin().token;
  const [title, setTitle] = useState("");
  const [time, setTime] = useState([now, then]);
  const [date, setDate] = useState(
    new Date(startingTime === 0 ? Date.now() : dateOnly(startingTime))
  );
  const [reason, setReason] = useState("");
  const [patientType, setPatientType] = useState("");
  const [loading, setLoading] = useState("");

  async function handleForm() {
    setLoading("loading");
    var link = process.env.REACT_APP_API_DOMAIN + "/NewEvent";
    const start = concatenateDateTime(date, time[0]);
    const end = concatenateDateTime(date, time[1]);
    try {
      const fetchResponse = await fetch(link, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: id,
          start: start,
          end: end,
          title: title,
          patientType: patientType,
          reason: reason,
          token: token,
        }),
      });
      const res = await fetchResponse.json();
      if (res.success) {
        setOpened(false);
        showNotification({
          title: "Consultation planifiée",
          message:
            "Le rendez-vous du " +
            displayDateInFrench(new Date(start)) +
            " a bien été enregistré.",
        });
      }
    } catch (e) {
      return e;
    }
  }

  return (
    <>
      {patientId === 0 && (
        <Autocomplete
          label="Patient"
          value={patient}
          onChange={setPatient}
          data={["Emilien Pluvinage", "Elsa Theillet", "Robert De Niro"]}
          required
        />
      )}
      <TextInput
        label="Titre"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
      />
      <DatePicker
        label="Jour de la consultation"
        locale="fr"
        value={date}
        onChange={setDate}
        inputFormat="DD/MM/YYYY"
        placeholder="Choisissez une date"
        icon={<Calendar size={16} />}
        required
      />
      <TimeRangeInput
        locale="fr"
        label="Heure de la consultation"
        value={time}
        onChange={setTime}
        required
      />
      <Textarea
        label="Motif de consultation"
        value={reason}
        onChange={(event) => setReason(event.currentTarget.value)}
        required
      />
      <Select
        label="Profil du Patient"
        data={["Nourrisson", "Enfant", "Femme enceinte", "Adulte"]}
        value={patientType}
        onChange={setPatientType}
        searchable
        nothingFound="Pas d'option"
      />
      <Center>
        <Button
          style={{ marginTop: "10px" }}
          onClick={handleForm}
          loading={loading}
        >
          Planifier
        </Button>
      </Center>
    </>
  );
}
