import React from "react";
import { useState } from "react";
import "../styles/MyCalendar.css";
import {
  datesAreOnSameDay,
  previousMonday,
  displayDate,
  addNdays,
  weekNumber,
  isInEvent,
  isFirstSlotOfEvent,
  RemoveOneStep,
  getEventId,
} from "./Functions";

export default function MyCalendar({ options, events }) {
  var eventId = 0;
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
        <div
          className="MyCalendar-btn"
          onClick={() => setDisplayedMonday((monday) => addNdays(monday, -7))}
        >
          &lt;
        </div>
        <div
          className="MyCalendar-btn"
          onClick={() => setDisplayedMonday((monday) => addNdays(monday, 7))}
        >
          &gt;
        </div>
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
                  ) &&
                    getEventId(
                      step.start,
                      events,
                      addNdays(displayedMonday, index)
                    )}{" "}
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