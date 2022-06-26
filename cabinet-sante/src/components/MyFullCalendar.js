import "../styles/styles.css";
import "../styles/FullCalendar.css";
import React from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import timeGridPlugin from "@fullcalendar/timegrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import { useLogin } from "./contexts/AuthContext";
import { useState } from "react";
import { concatenateDateTime, displayDateInFrench } from "./Functions";
import NewAppointment from "./NewAppointment";
import { Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import { useConfig } from "./contexts/ConfigContext";
import AppointmentDetails from "./AppointmentDetails";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import Caption from "./Caption";

export default function MyFullCalendar() {
  // triggers modal opening
  const [opened, setOpened] = useState(false);
  const [openedDetails, setOpenedDetails] = useState(false);
  // data from our contexts
  const appointments = usePatients().appointments;
  const patients = usePatients().patients;
  const token = useLogin().token;
  const appointmentTypes = useConfig().appointmentTypes;
  const parameters = useConfig().parameters;
  const updateContext = useUpdatePatients().update;

  // state
  const [appointmentId, setAppointmentId] = useState(0); // to know which appointment to update when clicking on it
  const [startingTime, setStartingTime] = useState(new Date()); // to know when to start a new appointment when clicking on an empty slot

  // input data for FullCalendarJS
  const buttonText = { today: "Semaine actuelle" };

  const startingHour = parameters.find((e) => e.name === "startingHour")?.value;
  const finishingHour = parameters.find(
    (e) => e.name === "finishingHour"
  )?.value;
  const daysOfTheWeek = JSON.parse(
    parameters.find((e) => e.name === "daysOfTheWeek")?.value
  );

  const daysOfTheWeekList = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  // Our days of the week list from the SQL DB contains the days we want to show, but fullCalendar.JS wants the days NOT to show
  const daysToExclude = daysOfTheWeekList.reduce(
    (acc, item, index) =>
      daysOfTheWeek.includes(item) ? acc : acc.concat([index]),
    []
  );

  //Convert an hour (number) into a string that fullCalendar can read (hh:mm:ss)
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

  // we transform the appointments list from the DB into events formatted nicely for fullCalendar to work
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
    .filter((e) => e.id !== null); // we remove empty appointments, that appear for example we the user removes a patient.

  // we add extra info to our events such as color and multi in order to display them correctly
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

  // update the time of an event when dragged by user in another slot
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
          start: new Date(start),
          end: new Date(end),
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
        await updateContext(token);
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
    // when users clicks somewhere on the calendar (outside an event), we create a new appointment
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
