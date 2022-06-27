import { Button, Center } from "@mantine/core";
import "../styles/styles.css";
import dayjs from "dayjs";
import { DateRangePicker } from "@mantine/dates";

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

export default function DateSelector({ value, setValue }) {
  const now = new Date();
  const yesterday = dayjs(now).subtract(1, "days").toDate();
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
    </>
  );
}
