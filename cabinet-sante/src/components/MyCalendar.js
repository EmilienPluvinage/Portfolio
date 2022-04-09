import React from "react";
import "../styles/MyCalendar.css";

export default function MyCalendar({ options }) {
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
        var start = i + ":" + j * 15;
        var end = j !== 3 ? i + ":" + (j + 1) * 15 : i + 1 + ":00";
        hours.push({ start: start, end: end, i: i, j: j });
      }
    }
    return hours;
  }

  return (
    <div className="MyCalendar-main">
      Calendar
      <div className="MyCalendar-content">
        <div className="MyCalendar-column-GMT" key={"GMT"}>
          <div className="MyCalendar-columnTitle" key={"GMTtitle"}>
            {"GMT"}
          </div>
          <div className="MyCalendar-columContent" key={"GMTcontent"}>
            {hours.map((step) => (
              <div
                key={step.start}
                className="MyCalendar-step-GMT"
                style={step.j === 0 ? { borderTop: "1px solid grey" } : null}
              >
                {step.j === 3 && step.end} &nbsp;
              </div>
            ))}
          </div>
        </div>
        {daysOfTheWeek.map((day) => (
          <div className="MyCalendar-column" key={day}>
            <div className="MyCalendar-columnTitle" key={day + "title"}>
              {day}
            </div>
            <div className="MyCalendar-columContent" key={day + "content"}>
              {hours.map((step) => (
                <div
                  key={step.start}
                  className="MyCalendar-step"
                  style={step.j === 0 ? { borderTop: "1px solid grey" } : null}
                >
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
