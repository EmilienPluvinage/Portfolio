import { useState } from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { Divider } from "react-native-paper";
import { usePatients } from "./contexts/PatientsContext";
import { displayTime } from "./Functions/Functions";

import Event from "./Event";

export default function Main() {
  // Data from context
  const appointments = usePatients().appointments;
  const patients = usePatients().patients;

  // State
  const [date, setDate] = useState(new Date());

  // Filtering data based on selected date
  const filteredAppointments = appointments.filter(
    (e) =>
      new Date(e.start).getFullYear() === date.getFullYear() &&
      new Date(e.start).getMonth() === date.getMonth() &&
      new Date(e.start).getDay() === date.getDay()
  );

  // Now we start drafting our displayed Data by isolating all unique appointment Ids
  const displayedData = filteredAppointments.reduce(
    (acc, item) =>
      acc.find((e) => e.appointmentId === item.appointmentId)
        ? acc
        : acc.concat([{ appointmentId: item.appointmentId }]),
    []
  );

  // now we extract only the data we need
  displayedData.forEach((item) => {
    const tempItem = filteredAppointments.find(
      (e) => e.appointmentId === item.appointmentId
    );
    item.start = tempItem.start;
    item.end = tempItem.end;
    item.title = tempItem.title;
    item.idType = tempItem.idType;

    // now we also need to get a list of patients
    const patientsList = filteredAppointments.reduce(
      (acc, element) =>
        element.appointmentId === item.appointmentId
          ? acc.concat([element.patientId])
          : acc,
      []
    );

    // and convert it into a string that can be displayed.
    item.patients = "";
    patientsList.forEach((patientId, index) => {
      item.patients += patients.find((e) => e.id === patientId)?.fullname;
      item.patients += index !== patientsList.length - 1 ? ", " : ".";
    });
  });

  // Finally we sort them by start date
  function compareDate(a, b) {
    let x = new Date(a.start);
    let y = new Date(b.start);

    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  }

  displayedData.sort(compareDate);

  // we also display the start and end of the workday
  const dailySummary =
    displayedData.length === 0
      ? "Pas de rendez-vous aujourd'hui."
      : `Journée de travail: ${displayTime(
          new Date(displayedData[0].start)
        )} - ${displayTime(
          new Date(displayedData[displayedData.length - 1].end)
        )}`;

  return (
    <>
      <View style={styles.item}>
        <Text style={styles.text}>{dailySummary}</Text>
      </View>
      <ScrollView>
        {displayedData.map((event, index) => (
          <View key={event.appointmentId}>
            <Event
              start={displayTime(new Date(event.start))}
              end={displayTime(new Date(event.end))}
              title={event.title}
              appointmentTypeId={event.idType}
              patients={event.patients}
            />
            {index !== displayedData.length - 1 &&
              displayTime(new Date(event.end)) !==
                displayTime(new Date(displayedData[index + 1].start)) && (
                <Divider style={styles.divider} />
              )}
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "rgb(40, 40, 40)",
    marginVertical: 5,
    borderRadius: 5,
    padding: 10,
  },
  divider: {
    backgroundColor: "transparent",
    marginVertical: 10,
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});
