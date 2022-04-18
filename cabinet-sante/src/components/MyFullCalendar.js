import "../styles/styles.css";
import "../styles/FullCalendar.css";
import React from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import timeGridPlugin from "@fullcalendar/timegrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import { useLogin } from "./contexts/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import {
  getAllEvents,
  concatenateDateTime,
  displayDateInFrench,
} from "./Functions";
import NewAppointment from "./NewAppointment";
import { Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import { useConfig } from "./contexts/ConfigContext";
import AppointmentDetails from "./AppointmentDetails";

export default function MyFullCalendar() {
  const [opened, setOpened] = useState(false);
  const [openedDetails, setOpenedDetails] = useState(false);
  const [startingTime, setStartingTime] = useState(new Date());

  const token = useLogin().token;
  const buttonText = { today: "Semaine actuelle" };
  const [events, setEvents] = useState([]);
  const [calendarUpdate, setCalendarUpdate] = useState(0);
  const [appointmentId, setAppointmentId] = useState(0);
  const appointmentTypes = useConfig().appointmentTypes;

  console.log(events);

  useEffect(() => {
    if (appointmentTypes?.length > 0) {
      async function fetchData() {
        try {
          const data = await getAllEvents(token);
          if (data.success) {
            var events = data.data;
            events.forEach((element) => {
              var color = appointmentTypes.find(
                (e) => e.id === element.idType
              ).color;
              element.backgroundColor = color;
            });
            setEvents(events);
            console.log(events);
          }
        } catch (error) {
          console.error(error);
        }
      }
      fetchData();
    }
  }, [token, calendarUpdate, opened, openedDetails, appointmentTypes]);

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
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          hiddenDays={[0]}
          slotMinTime={"08:00:00"}
          slotMaxTime={"21:00:00"}
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
