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

export function moveToFirst(array, value) {
  let index = array.indexOf(value);
  if (index !== -1) {
    array.unshift(array.splice(index, 1)[0]);
  }
}
export function concatenateDateTime(date, time) {
  var month = date.getMonth() + 1;
  return (
    date.getFullYear() +
    "-" +
    (month.toString().length === 1 ? "0" + month : month) +
    "-" +
    date.getDate() +
    " " +
    time.getHours() +
    ":" +
    time.getMinutes() +
    ":00"
  );
}
export function dateOnly(str) {
  var date = new Date(str);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  );
}

export function timeOnly(str) {
  var date = new Date(str);
  return new Date(0, 0, 0, date.getHours(), date.getMinutes(), 0, 0);
}

export function displayDateInFrench(date) {
  var minutes = date.getMinutes();
  const mois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  return (
    date.getDate() +
    " " +
    mois[date.getMonth()] +
    " " +
    date.getFullYear() +
    " à " +
    date.getHours() +
    "h" +
    (minutes.toString().length === 1 ? "0" + minutes : minutes)
  );
}

export async function getAllEvents(token) {
  try {
    const fetchResponse = await fetch(
      process.env.REACT_APP_API_DOMAIN + "/GetAllEvents",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
        }),
      }
    );
    const res = await fetchResponse.json();
    return res;
  } catch (e) {
    return e;
  }
}

export function calculateAge(date) {
  const birthdate = new Date(date);
  const now = new Date(Date.now());
  var diff = new Date(now - birthdate);
  return diff.getFullYear() - 1970;
}

export function wasPatientModified(patient, patientFromTheList) {
  var pat1 = { ...patient };
  var pat2 = { ...patientFromTheList };
  // we remove the fields that are only present in patientfromtheList in order to compare all the other ones.
  delete pat2.fullname;
  delete pat2.id;
  delete pat2.userId;
  return JSON.stringify(pat1) !== JSON.stringify(pat2);
}

export function getFullnameFromId(patientsList, id) {
  var index = patientsList.findIndex((item) => item.id === id);
  return patientsList[index].fullname;
}

export function getIdFromFullname(patientsList, fullname) {
  var index = patientsList.findIndex((item) => item.fullname === fullname);
  return patientsList[index].id;
}
