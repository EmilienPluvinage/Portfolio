import "../styles/styles.css";
import { DateRangePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { useState } from "react";
import { Button, Center } from "@mantine/core";

function DateButton({ children, setValue, start, end }) {
  return (
    <Button
      onClick={() => setValue([start, end])}
      variant="outline"
      size="xs"
      style={{ margin: "5px" }}
    >
      {children}
    </Button>
  );
}

export default function Accountancy() {
  const now = new Date();
  const yesterday = dayjs(now).subtract(1, "days").toDate();
  const before = dayjs(now).add(-7, "days").toDate();
  const [value, setValue] = useState([before, now]);
  const startOfMonth = dayjs(now).startOf("month").toDate();
  const endOfPreviousMonth = dayjs(startOfMonth).subtract(1, "days").toDate();
  const startOfPreviousMonth = dayjs(endOfPreviousMonth)
    .startOf("month")
    .toDate();
  const startOfYear = dayjs(now).startOf("year").toDate();
  const endOfPreviousYear = dayjs(startOfYear).subtract(1, "days").toDate();
  const startOfPreviousYear = dayjs(endOfPreviousYear).startOf("year").toDate();

  return (
    <>
      <h2>Compta</h2>
      <div className="main-content">
        <Center style={{ flexWrap: "wrap" }}>
          <DateButton setValue={setValue} start={yesterday} end={yesterday}>
            Hier
          </DateButton>
          <DateButton setValue={setValue} start={now} end={now}>
            Aujourd'hui
          </DateButton>
          <DateButton
            setValue={setValue}
            start={startOfPreviousMonth}
            end={endOfPreviousMonth}
          >
            Le mois dernier
          </DateButton>
          <DateButton setValue={setValue} start={startOfMonth} end={now}>
            Ce mois-ci
          </DateButton>
          <DateButton
            setValue={setValue}
            start={startOfPreviousYear}
            end={endOfPreviousYear}
          >
            L'année dernière
          </DateButton>
          <DateButton setValue={setValue} start={startOfYear} end={now}>
            Cette année
          </DateButton>
        </Center>
        <Center>
          <div style={{ width: "fit-content" }}>
            <DateRangePicker
              label="Sélectionnez la période à afficher"
              placeholder="Période à afficher"
              locale="fr"
              value={value}
              onChange={setValue}
              maxDate={new Date(Date.now())}
              inputFormat="DD/MM/YYYY"
            />
          </div>
        </Center>
        <Center>
          <Button style={{ margin: "10px" }}>Afficher</Button>
        </Center>
      </div>
    </>
  );
}
