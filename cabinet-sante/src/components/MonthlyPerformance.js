import MonthlyLineChart from "./MonthlyLineChart";
import { usePatients } from "./contexts/PatientsContext";
import { Center } from "@mantine/core";

// Date at which we rolled over from WebOsteo to Mon Cabinet Santé.
// Before that date the data will come exclusively from WebOsteo
// After that date it will be from Mon Cabinet Santé. No overlap.
// 1st of Jun 2022.
const start = new Date("06/01/2022");

export default function MonthlyPerformance() {
  function isBeforeStart(aDate) {
    const tempDate = new Date(aDate);
    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const tempYear = tempDate.getFullYear();
    const tempMonth = tempDate.getMonth();
    if (tempYear < startYear) {
      return true;
    } else if (tempYear > startYear) {
      return false;
    } else {
      if (tempMonth < startMonth) {
        return true;
      } else {
        return false;
      }
    }
  }

  // Historical data exported from WebOsteo, from Jan 21 to May 22.
  const history = usePatients().historicalData;

  function createCategories() {
    const months = [
      { name: "Janvier" },
      { name: "Février" },
      { name: "Mars" },
      { name: "Avril" },
      { name: "Mai" },
      { name: "Juin" },
      { name: "Juillet" },
      { name: "Août" },
      { name: "Septembre" },
      { name: "Octobre" },
      { name: "Novembre" },
      { name: "Décembre" },
    ];
    return months.slice();
  }

  function addHistoricalData(array) {
    for (const element of history) {
      let thisDate = new Date(element.date);
      array[thisDate.getMonth()][thisDate.getFullYear()] = element.value / 100;
    }
  }

  // performance data, not taking into account treasury
  let perfData = createCategories();
  addHistoricalData(perfData);

  // Actual data from our own app, from Jun 22 onwards.
  const appointments = usePatients().appointments;
  for (const element of appointments) {
    let thisDate = new Date(element.start);
    // We make sure it is indeed from Jun 22 onwards
    if (!isBeforeStart(thisDate)) {
      if (perfData[thisDate.getMonth()][thisDate.getFullYear()]) {
        perfData[thisDate.getMonth()][thisDate.getFullYear()] +=
          element.price / 100;
      } else {
        perfData[thisDate.getMonth()][thisDate.getFullYear()] =
          element.price / 100;
      }
    }
  }

  // payementData, depends only on payement dates and not when the appointments happen
  let payementData = createCategories();
  addHistoricalData(payementData);

  const payements = usePatients().payements;
  for (const element of payements) {
    let thisDate = new Date(element.date);
    // We make sure it is indeed from Jun 22 onwards
    if (!isBeforeStart(thisDate)) {
      if (payementData[thisDate.getMonth()][thisDate.getFullYear()]) {
        payementData[thisDate.getMonth()][thisDate.getFullYear()] +=
          element.amount / 100;
      } else {
        payementData[thisDate.getMonth()][thisDate.getFullYear()] =
          element.amount / 100;
      }
    }
  }

  return (
    <>
      <Center>
        <h2>Performance</h2>
      </Center>
      <MonthlyLineChart data={perfData} />
      <Center>
        <h2>Encaissements</h2>
      </Center>
      <MonthlyLineChart data={payementData} />
    </>
  );
}
