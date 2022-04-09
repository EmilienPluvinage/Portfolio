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

export function displayDate(today, dateOnly) {
  var month = today.getMonth() + 1;

  var date =
    today.getDate() +
    "-" +
    (month.toString().length === 1 ? "0" + month : month) +
    "-" +
    today.getFullYear() +
    (!dateOnly
      ? " " +
        today.getHours() +
        ":" +
        (today.getMinutes().toString().length === 1
          ? "0" + today.getMinutes()
          : today.getMinutes())
      : "");

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
