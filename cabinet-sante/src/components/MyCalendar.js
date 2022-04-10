import React from "react";
import { useState, useEffect } from "react";
import "../styles/MyCalendar.css";
import { datesAreOnSameDay, displayDate } from "./Functions";
import {
  addNdays,
  weekNumber,
  isInEvent,
  isFirstSlotOfEvent,
  RemoveOneStep,
  getEventId,
  previousMonday,
  getEvents,
} from "./MyCalendarFunctions";
import { useLogin } from "./contexts/AuthContext";
import { Button } from "@mantine/core";
import CalendarEvent from "./CalendarEvent";

export default function MyCalendar({ options }) {
  // const events = [
  //   {
  //     id: 34,
  //     day: new Date(Date.now()),
  //     start: "9:00",
  //     end: "10:00",
  //     title: "RDV",
  //   },
  //   {
  //     id: 35,
  //     day: new Date(Date.now()),
  //     start: "11:00",
  //     end: "11:30",
  //     title: "RDV",
  //   },
  //   {
  //     id: 36,
  //     day: new Date(Date.now()),
  //     start: "14:00",
  //     end: "17:00",
  //     title: "RDV",
  //   },
  // ];

  const today = Date.now();
  const thisMonday = previousMonday(new Date(today));
  const dayOfTheWeek = new Date(today).getDay();
  const [displayedMonday, setDisplayedMonday] = useState(
    previousMonday(new Date(today))
  );
  const displayedWeek = weekNumber(displayedMonday);
  const daysOfTheWeek = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];
  const hours = hoursOfTheDay();
  const token = useLogin().token;
  const [events, setEvents] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getEvents(
          token,
          displayedMonday,
          new Date(addNdays(displayedMonday, 6))
        );
        if (data.success) {
          setEvents(data.data);
        }
        // switch loading to false after fetch is complete
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [token, displayedMonday]);

  // we'll go from 0 to 24 with a step of 1/4h
  function hoursOfTheDay() {
    var hours = [];
    for (let i = options.dayStart; i < options.dayEnd; i++) {
      for (let j = 0; j < 4; j++) {
        var start = i + ":" + (j === 0 ? "00" : j * 15);
        var end = j !== 3 ? i + ":" + (j + 1) * 15 : i + 1 + ":00";
        hours.push({ start: start, end: end, i: i, j: j });
      }
    }
    return hours;
  }

  return (
    <div className="MyCalendar-main">
      <div className="MyCalendar-nav">
        <Button
          style={{ margin: "5px" }}
          onClick={() => setDisplayedMonday((monday) => addNdays(monday, -7))}
        >
          &lt;
        </Button>
        <Button
          style={{ margin: "5px" }}
          onClick={() => setDisplayedMonday((monday) => addNdays(monday, 7))}
        >
          &gt;
        </Button>
        <div>Semaine {displayedWeek}</div>
      </div>
      <div className="MyCalendar-content">
        <div className="MyCalendar-column-GMT" key={"GMT"}>
          <div className="MyCalendar-columnTitleGMT" key={"GMTtitle"}>
            <div className="MyCalendar-nottoday">&nbsp;</div>
            <div className="MyCalendar-nottoday">&nbsp;</div>
          </div>
          <div className="MyCalendar-columContent" key={"GMTcontent"}>
            {hours.map((step) => (
              <div
                key={step.start}
                className="MyCalendar-step-GMT"
                style={step.j === 0 ? { borderTop: "1px solid white" } : null}
              >
                {step.j === 3 && step.end} &nbsp;
              </div>
            ))}
          </div>
        </div>
        {daysOfTheWeek.map((day, index) => (
          <div className="MyCalendar-column" key={day}>
            <div className="MyCalendar-columnTitle" key={day + "title"}>
              <div
                className={
                  (index + 1) % 7 === dayOfTheWeek &&
                  datesAreOnSameDay(thisMonday, displayedMonday)
                    ? "MyCalendar-today"
                    : "MyCalendar-nottoday"
                }
              >
                {day}
              </div>
              <div
                className={
                  (index + 1) % 7 === dayOfTheWeek &&
                  datesAreOnSameDay(thisMonday, displayedMonday)
                    ? "MyCalendar-today"
                    : "MyCalendar-nottoday"
                }
              >
                {displayDate(addNdays(displayedMonday, index))}
              </div>
            </div>
            <div className="MyCalendar-columContent" key={day + "content"}>
              {hours.map((step) => (
                <div
                  key={step.start}
                  className={
                    isInEvent(
                      step.start,
                      events,
                      addNdays(displayedMonday, index)
                    )
                      ? "MyCalendar-event"
                      : "MyCalendar-step"
                  }
                  style={
                    step.j === 0 ? { borderTop: "1px solid lightgray" } : null
                  }
                >
                  {isFirstSlotOfEvent(
                    step.start,
                    events,
                    addNdays(displayedMonday, index)
                  ) && (
                    <CalendarEvent
                      text={getEventId(
                        step.start,
                        events,
                        addNdays(displayedMonday, index)
                      )}
                    />
                  )}
                  &nbsp;
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
