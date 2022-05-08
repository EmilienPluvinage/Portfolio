import "../styles/styles.css";
import "../styles/FullCalendar.css";
import React, { useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import timeGridPlugin from "@fullcalendar/timegrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import { useLogin } from "./contexts/AuthContext";
import { useState } from "react";
import { concatenateDateTime, displayDateInFrench } from "./Functions";
import NewAppointment from "./NewAppointment";
import { Button, Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Check, Refresh, X } from "tabler-icons-react";
import { useConfig } from "./contexts/ConfigContext";
import AppointmentDetails from "./AppointmentDetails";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import Caption from "./Caption";

export default function MyFullCalendar() {
  const [opened, setOpened] = useState(false);
  const updateContext = useUpdatePatients().update;
  const [openedDetails, setOpenedDetails] = useState(false);
  const [startingTime, setStartingTime] = useState(new Date());
  const appointments = usePatients().appointments;
  const patients = usePatients().patients;
  const token = useLogin().token;
  const buttonText = { today: "Semaine actuelle" };
  const [calendarUpdate, setCalendarUpdate] = useState(0);
  const [appointmentId, setAppointmentId] = useState(0);
  const appointmentTypes = useConfig().appointmentTypes;
  const parameters = useConfig().parameters;
  const startingHour = parameters.find((e) => e.name === "startingHour")?.value;
  const finishingHour = parameters.find(
    (e) => e.name === "finishingHour"
  )?.value;
  const daysOfTheWeek = JSON.parse(
    parameters.find((e) => e.name === "daysOfTheWeek")?.value
  );

  useEffect(() => {
    if (calendarUpdate !== 0) {
      setCalendarUpdate(0);
      async function update() {
        await updateContext(token);
      }
      update();
      console.log("update");
    }
  }, [token, updateContext, calendarUpdate]);

  console.log(appointments);

  const daysOfTheWeekList = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  const daysToExclude = daysOfTheWeekList.reduce(
    (acc, item, index) =>
      daysOfTheWeek.includes(item) ? acc : acc.concat([index]),
    []
  );

  function convertIntoTimeString(hour) {
    switch (hour?.toString().length) {
      case 1:
        return `0${hour.toString()}:00:00`;
      case 2:
        return `${hour.toString()}:00:00`;
      default:
        return "00:00:00";
    }
  }

  // d'abord un accumulateur pour récupérer que les infos qu'on veut
  var events = appointments
    .reduce(
      (acc, item) =>
        acc.find((e) => e.id === item.appointmentId)
          ? acc
          : acc.concat({
              id: item.appointmentId,
              patientId: item.patientId,
              userId: item.userId,
              start: item.start,
              end: item.end,
              idType: item.idType,
            }),
      []
    )
    .filter((e) => e.id !== null);
  events.forEach((element) => {
    var color = appointmentTypes.find((e) => e.id === element.idType).color;
    element.backgroundColor = color;
    var multi = appointmentTypes.find((e) => e.id === element.idType).multi;
    if (multi === 0) {
      element.title = patients.find(
        (e) => e.id === element.patientId
      )?.fullname;
    } else {
      // we count the number of participants
      var count = appointments.reduce(
        (acc, e) => (e.appointmentId === element.id ? acc + 1 : acc),
        0
      );
      element.title = `${count} participant(s)`;
    }
  });

  async function updateEventTime(id, startingTime, endingTime, src) {
    var link = process.env.REACT_APP_API_DOMAIN + "/UpdateEventTime";
    const start = concatenateDateTime(startingTime, startingTime);
    const end = concatenateDateTime(endingTime, endingTime);
    try {
      const fetchResponse = await fetch(link, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          start: start,
          end: end,
          token: token,
        }),
      });
      const res = await fetchResponse.json();
      if (res.success) {
        const msg =
          src === "drop"
            ? "Le rendez-vous a bien été déplacé au " +
              displayDateInFrench(new Date(start)) +
              "."
            : "La durée du rendez-vous a bien été modifiée";
        showNotification({
          title: "Consultation modifiée",
          message: msg,
          icon: <Check />,
          color: "green",
        });
        setCalendarUpdate((e) => e + 1);
      } else {
        showNotification({
          title: "Erreur",
          message: res.error.code,
          icon: <X />,
          color: "red",
        });
        console.log(res.error);
      }
    } catch (e) {
      return e;
    }
  }

  function handleEventClick(arg) {
    // when user clicks on an event, we need to know whether it's a group event or a solo event.
    const appointmentTypeId = events.find(
      (e) => e.id.toString() === arg.event.id.toString()
    ).idType;
    const multi = appointmentTypes.find(
      (e) => e.id === appointmentTypeId
    ).multi;
    setAppointmentId(arg.event.id);
    if (multi === 1) {
      setOpened(true);
    } else {
      setOpenedDetails(true);
    }
  }
  function handleDateClick(arg) {
    // when users clicks somewhere on the calendar (outside an event)
    setStartingTime(arg.dateStr);
    setAppointmentId(0);
    setOpened(true);
  }

  function handleEventDrop(arg) {
    // when an event is moved
    updateEventTime(arg.event.id, arg.event.start, arg.event.end, "drop");
  }
  function handleEventResize(arg) {
    // when an event is resized
    updateEventTime(arg.event.id, arg.event.start, arg.event.end, "resize");
  }
  function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <br />
        <i>{eventInfo.event.title}</i>
      </>
    );
  }
  return (
    <>
      <Modal
        centered
        overlayOpacity={0.3}
        opened={opened}
        onClose={() => setOpened(false)}
        title={"Consultation"}
        closeOnClickOutside={false}
      >
        {opened && (
          <NewAppointment
            setOpened={setOpened}
            startingTime={startingTime}
            patientId={0}
            appointmentId={appointmentId}
            setCalendarUpdate={setCalendarUpdate}
          />
        )}
      </Modal>
      <Modal
        centered
        overlayOpacity={0.3}
        opened={openedDetails}
        onClose={() => setOpenedDetails(false)}
        title={"Consultation"}
        closeOnClickOutside={false}
        size="50%"
      >
        {openedDetails && (
          <AppointmentDetails
            setOpened={setOpenedDetails}
            patientId={0}
            appointmentId={appointmentId}
          />
        )}
      </Modal>
      <Button
        style={{ marginTop: "10px", marginLeft: "20px" }}
        onClick={() => setCalendarUpdate((prev) => prev + 1)}
      >
        <Refresh size={25} />
      </Button>
      <h2>Agenda</h2>
      <div className="main-content">
        <Caption appointmentTypes={appointmentTypes} />
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          hiddenDays={daysToExclude}
          slotMinTime={convertIntoTimeString(startingHour)}
          slotMaxTime={convertIntoTimeString(finishingHour)}
          contentHeight={"auto"}
          nowIndicator={true}
          allDaySlot={false}
          editable={true}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          locale={"fr"}
          buttonText={buttonText}
          eventBackgroundColor={"#22b8cf"}
          eventBorderColor={"#d3d3d3"}
        />
      </div>
    </>
  );
}
