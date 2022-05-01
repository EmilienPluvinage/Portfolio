import { useState } from "react";
import "../styles/styles.css";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { Calendar, Check, Copy, X } from "tabler-icons-react";
import dayjs from "dayjs";
import { Button, Center, Grid, Modal } from "@mantine/core";
import { concatenateDateTime, displayDateInFrench } from "./Functions";
import { useLogin } from "./contexts/AuthContext";
import { showNotification } from "@mantine/notifications";
import { DatePicker, TimeRangeInput } from "@mantine/dates";

export default function DuplicateEvent({ appointmentId, parentSetOpened }) {
  const token = useLogin().token;
  const updateContext = useUpdatePatients().update;
  const appointments = usePatients().appointments;
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState("");
  const start = appointments.find(
    (app) => app.appointmentId?.toString() === appointmentId?.toString()
  )?.start;
  const end = appointments.find(
    (app) => app.appointmentId?.toString() === appointmentId?.toString()
  )?.end;
  const inAWeek = dayjs(start).add(7, "days").toDate();
  const [time, setTime] = useState([new Date(start), new Date(end)]);
  const [date, setDate] = useState(new Date(inAWeek));

  async function submitForm() {
    setLoading("loading");
    const res = await duplicateAppointment();
    if (res.success) {
      showNotification({
        title: `Rendez-vous copié`,
        message: `Rendez-vous copié avec succès au ${displayDateInFrench(
          concatenateDateTime(date, time[0])
        )}`,
        color: "green",
        icon: <Check />,
      });
      updateContext(token);
      setOpened(false);
      parentSetOpened(false);
    } else {
      showNotification({
        title: `Erreur`,
        message: res.error,
        color: "red",
        icon: <X />,
      });
    }
    setLoading("");
  }

  async function duplicateAppointment() {
    var link = process.env.REACT_APP_API_DOMAIN + "/DuplicateEvent";
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
          start: start,
          end: end,
          appointmentId: appointmentId,
          token: token,
        }),
      });
      const res = await fetchResponse.json();
      return res;
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
          title={"Dupliquer un rendez-vous"}
          closeOnClickOutside={false}
        >
          <form>
            <Grid grow>
              <Grid.Col span={2}>
                <DatePicker
                  label="Jour de la consultation"
                  locale="fr"
                  name="date"
                  value={date}
                  onChange={setDate}
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
                  value={time}
                  onChange={setTime}
                  required
                />
              </Grid.Col>
            </Grid>
            <Center>
              <Button
                style={{ marginTop: "20px" }}
                onClick={submitForm}
                loading={loading}
              >
                Confirmer
              </Button>
            </Center>
          </form>
        </Modal>
      )}

      <Button
        onClick={() => setOpened(true)}
        leftIcon={<Copy size={18} />}
        variant="outline"
        style={{ marginLeft: "3px" }}
      >
        Dupliquer
      </Button>
    </>
  );
}
