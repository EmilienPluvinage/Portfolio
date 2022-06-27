import { Button, Center } from "@mantine/core";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "tabler-icons-react";
import "../styles/styles.css";
import { useConfig } from "./contexts/ConfigContext";
import { usePatients } from "./contexts/PatientsContext";
import DoublePieChart from "./DoublePieChart";

const months = [
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

export default function HomeStats() {
  // data from context
  const appointments = usePatients().appointments.filter((e) => e.id !== null);
  const appointmentTypes = useConfig().appointmentTypes;
  const colors = appointmentTypes.map((e) => e.color);

  // dates
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  // change the month of which the date is being displayed
  function changeDate(number) {
    if (month === 11 && number === 1) {
      // It's december and we move to January next year
      setMonth(0);
      setYear(year + 1);
    } else if (month === 0 && number === -1) {
      // It's January and we move to December last year
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month + number);
    }
  }

  // initialise data array with categories names
  function createCategories() {
    if (appointmentTypes.length > 0) {
      const categories = appointmentTypes.map((e) => {
        return { name: e.type, value: 0 };
      });
      return categories.slice();
    }
  }

  let numbers = createCategories();
  let values = createCategories();
  let appointmentIds = [];

  for (const element of appointments) {
    // first we check the date
    let thisDate = new Date(element.start);
    if (thisDate.getFullYear() === year && thisDate.getMonth() === month) {
      // let's find the right category
      let type = appointmentTypes.find((e) => e.id === element.idType)?.type;
      let index = values.findIndex((e) => e.name === type);

      // we add the price to our total value
      values[index].value += element.price / 100;

      // we add +1 only if the appointments hasn't been counted already
      if (appointmentIds.findIndex((e) => e === element.appointmentId) === -1) {
        appointmentIds.push(element.appointmentId);
        numbers[index].value++;
      }
    }
  }

  return (
    <div>
      <h2>Performance</h2>

      <div className="home-content">
        {" "}
        <Center>
          <Button compact variant="outline" onClick={() => changeDate(-1)}>
            <ChevronLeft size={18} />
          </Button>
          <h2 style={{ marginRight: "30px" }}>
            {months[month]} {year}
          </h2>
          <Button compact variant="outline" onClick={() => changeDate(1)}>
            <ChevronRight size={18} />
          </Button>
        </Center>
        <DoublePieChart data1={numbers} data2={values} colors={colors} />
      </div>
    </div>
  );
}
