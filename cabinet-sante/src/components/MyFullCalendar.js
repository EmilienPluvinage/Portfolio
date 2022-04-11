import "../styles/styles.css";
import "../styles/FullCalendar.css";
import React from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import timeGridPlugin from "@fullcalendar/timegrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import { useLogin } from "./contexts/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import { getAllEvents } from "./MyCalendarFunctions";

export default function MyFullCalendar() {
  const token = useLogin().token;
  const buttonText = { today: "Semaine actuelle" };
  const [events, setEvents] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllEvents(token);
        if (data.success) {
          setEvents(data.data);
        }
        // switch loading to false after fetch is complete
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [token]);

  function handleDateClick(arg) {
    alert(arg.dateStr);
  }
  function handleEventClick(arg) {
    alert(arg.event.id);
  }
  function handleEventDrop(arg) {
    alert(arg.event.start + " " + arg.event.end);
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
          locale={"fr"}
          buttonText={buttonText}
          eventBackgroundColor={"#22b8cf"}
          eventBorderColor={"#0C8599{"}
        />
      </div>
    </>
  );
}
