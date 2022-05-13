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

export function getUniqueSharedPatients(sharedBalance, patientId) {
  var patients = [patientId];
  var previousLength = 0;
  var tempPatients = [];
  while (patients.length > previousLength) {
    previousLength = patients.length;
    tempPatients = patients.slice();
    for (let i = 0; i < patients.length; i++) {
      tempPatients = tempPatients.concat(
        getSharedPatients(sharedBalance, patients[i])
      );
    }
    // remove duplicates
    patients = tempPatients
      .reduce(
        (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
        []
      )
      .slice();
  }
  return patients;
}

export function getSharedPatients(sharedBalance, patientId) {
  // get all the IDs
  var patients = sharedBalance.reduce(
    (acc, item) =>
      item.patientId1 === patientId
        ? acc.concat(item.patientId2)
        : item.patientId2 === patientId
        ? acc.concat(item.patientId1)
        : acc,
    []
  );
  // removes duplicates if there are any
  return patients.reduce(
    (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
    []
  );
}

export function displayPrice(priceInCents) {
  if (priceInCents === undefined) return 0;
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

export function displayFullDate(today) {
  if (isNaN(today)) return "";
  var day = today.getDate();
  var month = today.getMonth();
  var year = today.getFullYear();

  var date =
    (day.toString().length === 1 ? "0" + day : day) +
    " " +
    mois[month] +
    " " +
    year;

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

export function displayDateInFrench(strdate) {
  var date = new Date(strdate);
  var minutes = date.getMinutes();

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

export function sortByDepartment(array, number) {
  // Take all the cities from number department and move them to the top of the array
  // so that they show up first in the autocomplete form input.

  var citiesToTheTop = array.filter(
    (element) => element.codeDepartement === number
  );
  var citiesToTheBottom = array.filter(
    (element) => element.codeDepartement !== number
  );
  return citiesToTheTop.concat(citiesToTheBottom);
}

export function splitname(fullname) {
  const [firstName, ...lastName] = fullname.split(" ").filter(Boolean);
  return {
    firstname: firstName,
    lastname: lastName.join(" "),
  };
}

export function setAutomaticPrice(
  priceScheme,
  patientTypeId,
  appointmentTypeId,
  packageId
) {
  var price = 0;
  var index = 0;

  // appointmentTypeId can't be 0 since this is a required field
  if (appointmentTypeId === 0) return 0;

  // test si tu trouves une règle qui remplit les 3 conditions
  index = priceScheme.findIndex(
    (e) =>
      e.appointmentTypeId === appointmentTypeId &&
      e.packageId === packageId &&
      e.patientTypeId === patientTypeId
  );
  if (index !== -1) return priceScheme[index].price;

  // sinon, test si tu trouves une qui remplit 2 des 3 conditions (en virant d'abord type de patient, ensuite forfait)
  index = priceScheme.findIndex(
    (e) =>
      e.appointmentTypeId === appointmentTypeId && e.packageId === packageId
  );
  if (index !== -1) return priceScheme[index].price;

  index = priceScheme.findIndex(
    (e) =>
      e.appointmentTypeId === appointmentTypeId &&
      e.patientTypeId === patientTypeId
  );
  if (index !== -1) return priceScheme[index].price;

  // sinon test si trouve une qui remplit 1 des 3 conditions (tester consultation uniquement, car consultation existe forcément.)
  index = priceScheme.findIndex(
    (e) => e.appointmentTypeId === appointmentTypeId
  );
  if (index !== -1) return priceScheme[index].price;

  return price;
}

// functions used in balance calculation

export function calculateBalance(data, payementsData) {
  const balance = data.reduceRight(
    (acc, item) =>
      item.dataType === "event"
        ? acc.concat(
            (acc.length > 0 ? acc[acc.length - 1] : 0) -
              (item.payed === 1
                ? item.price -
                  payementsData.find((e) => e.eventId === item.id)?.amount
                : item.price)
          )
        : acc.concat((acc.length > 0 ? acc[acc.length - 1] : 0) + item?.amount),
    []
  );

  data.forEach(
    (obj, index) =>
      (data[index] = { ...obj, balance: balance[balance.length - 1 - index] })
  );
}

export function insertPackageIntoArray(array, pack) {
  var index = array.findIndex((e) => e.start < pack.date);
  if (index !== -1) {
    array.splice(index, 0, pack);
  } else {
    // pack.date is the oldest event, we push it at the end of the array
    array.push(pack);
  }
}
