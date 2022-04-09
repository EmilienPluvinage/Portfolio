export function displayPrice(priceInCents) {
  // displays the price with a comma and two decimals, unless it's 0, in which case we return 0.
  var i = Math.round(priceInCents).toString().length - 2;
  var result =
    priceInCents === 0
      ? 0
      : (i > 0 ? priceInCents.toString().slice(0, i) : "0") +
        "," +
        (i === -1 ? "0" : "") +
        priceInCents.toString().slice(i, i + 2);
  return result;
}

export function displayPercentage(value) {
  return (Math.round(value * 10000) / 100).toString() + "%";
}

export function displayDate(today) {
  var day = today.getDate();
  var month = today.getMonth() + 1;

  var date =
    (day.toString().length === 1 ? "0" + day : day) +
    " / " +
    (month.toString().length === 1 ? "0" + month : month);

  return date;
}

export function displayTime(today) {
  var date =
    today.getHours() +
    ":" +
    (today.getMinutes().toString().length === 1
      ? "0" + today.getMinutes()
      : today.getMinutes());

  return date;
}

export const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export function wordCapitalize(word) {
  if (word?.length > 0) {
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  } else {
    return "";
  }
}

export function capitalize(string) {
  // we split the string and capitalize each word separately
  const words = string.split("-");
  var res = "";
  for (let i = 0; i < words.length; i++) {
    res += "-" + wordCapitalize(words[i]);
  }
  return res.slice(1);
}

export function weekNumber(date) {
  var oneJan = new Date(date.getFullYear(), 0, 1);
  var oneJanDay = oneJan.getDay();
  var numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  var result = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
  // if the first day of Jan was one a Friday, Saturday or Sunday, then is doesn't count as the first week of the year
  // and is still the last week of the previous year. As a consequence, we remove 1 to our result.
  // note that this is a European rule that doesn't apply in the US.
  if (oneJanDay === 5 || oneJanDay === 6 || oneJanDay === 0) result--;
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
