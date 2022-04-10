import { datesAreOnSameDay } from "./Functions";
export function weekNumber(date) {
  var oneJan = new Date(date.getFullYear(), 0, 1);
  //var oneJanDay = oneJan.getDay();
  var numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  var result = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
  // if the first day of Jan was one a Friday, Saturday or Sunday, then is doesn't count as the first week of the year
  // and is still the last week of the previous year. As a consequence, we remove 1 to our result.
  // note that this is a European rule that doesn't apply in the US.
  //if (oneJanDay === 5 || oneJanDay === 6 || oneJanDay === 0) result--;
  return result;
}
export function previousMonday(date) {
  // return the monday of the week "date" is in.
  var day = date.getDay();
  if (day !== 1) {
    // if it's sunday we remove 6 days
    var daysToRemove = 6;
    if (day !== 0) {
      // otherwise we remove day - 1
      daysToRemove = day - 1;
    }
    date.setDate(date.getDate() - daysToRemove);
  }
  return date;
}

export function addNdays(date, n) {
  var newDate = new Date(date);
  newDate.setDate(newDate.getDate() + n);
  return newDate;
}

export function isBetween(time, start, end) {
  // checks if time is between start and end, where all dates are formated with "hh:mm"

  var timeDate = stringToDate(time);
  var startDate = stringToDate(start);
  var endDate = stringToDate(end);

  return timeDate >= startDate && timeDate < endDate;
}

function stringToDate(string) {
  // converts a string in format "hh:mm" into a date
  const array = string.split(":");
  var date = new Date();
  date.setHours(array[0], array[1], 0);
  return date;
}

export function isInEvent(time, events, day) {
  var result = false;
  for (let i = 0; i < events.length; i++) {
    if (
      isBetween(time, events[i].start, events[i].end) &&
      datesAreOnSameDay(events[i].day, day)
    ) {
      return true;
    }
  }
  return result;
}

export function getEventId(time, events, day) {
  var result = false;
  for (let i = 0; i < events.length; i++) {
    if (
      isBetween(time, events[i].start, events[i].end) &&
      datesAreOnSameDay(events[i].day, day)
    ) {
      return events[i].id;
    }
  }
  return result;
}

export function isFirstSlotOfEvent(time, events, day) {
  return (
    isInEvent(time, events, day) && !isInEvent(RemoveOneStep(time), events, day)
  );
}

export function AddOneStep(time) {
  // adds 15 minutes to a "hh:mm" time format
  const array = time.split(":");
  var newHours = array[0];
  var newMinutes = "00";
  switch (array[1]) {
    case "00":
      newMinutes = "15";
      break;
    case "15":
      newMinutes = "30";
      break;
    case "30":
      newMinutes = "45";
      break;
    case "45":
      newMinutes = "00";
      newHours = (parseInt(newHours) + 1).toString();
      break;
    default:
      break;
  }
  return newHours + ":" + newMinutes;
}

export function RemoveOneStep(time) {
  // removes 15 minutes to a "hh:mm" time format
  const array = time.split(":");
  var newHours = array[0];
  var newMinutes = "00";
  switch (array[1]) {
    case "00":
      newMinutes = "45";
      newHours = (parseInt(newHours) - 1).toString();
      break;
    case "15":
      newMinutes = "00";
      break;
    case "30":
      newMinutes = "15";
      break;
    case "45":
      newMinutes = "30";

      break;
    default:
      break;
  }
  return newHours + ":" + newMinutes;
}
