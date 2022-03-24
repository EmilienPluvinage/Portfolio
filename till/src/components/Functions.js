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

export const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export function queryData(callback, collection) {
  fetch("http://localhost:3001/" + collection, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }
      return response.json();
    })
    .then((actualData) => callback(actualData))
    .catch((err) => {
      console.log(err.message);
    });
}
