import { ScrollView, View, StyleSheet, Text } from "react-native";
import { usePatients } from "./contexts/PatientsContext";
import { useState } from "react";
import { BalanceByPatient } from "./Functions/Functions";
import PatientSearch from "./PatientSearch";
import BalanceDetails from "./BalanceDetails";

export default function Balance() {
  // data from context
  const patients = usePatients().patients;
  const patientsList = patients.map((patient) => {
    return { fullname: patient.fullname, id: patient.id };
  });
  patientsList.sort((a, b) => a.label > b.label);
  const payements = usePatients().payements;
  const appointments = usePatients().appointments;
  const sharedBalance = usePatients().sharedBalance;

  // state
  const [patient, setPatient] = useState(0);
  const balance = BalanceByPatient(
    patient,
    appointments,
    sharedBalance,
    payements
  );

  const dataToDisplay = [];
  for (const thisPatient of patients) {
    let thisBalance = BalanceByPatient(
      thisPatient?.id,
      appointments,
      sharedBalance,
      payements
    );
    if (thisBalance < 0) {
      dataToDisplay.push({
        id: thisPatient?.id,
        fullname: thisPatient?.fullname,
        balance: thisBalance,
      });
    }
  }

  function selectPatient(patient) {
    setPatient(patient.id);
  }

  return (
    <>
      <ScrollView>
        <View style={styles.item}>
          <View style={styles.addReminder}>
            <View style={styles.patientSearch}>
              <PatientSearch
                patientsList={patientsList}
                addPatient={selectPatient}
                multi={false}
                patientId={patient}
                patients={patients}
              />
            </View>
            <Text
              style={{
                ...styles.text,
                color: balance < 0 ? "#FA5252" : "white",
              }}
            >
              {patient !== 0 && `${balance / 100} €`}
            </Text>
            {patient !== 0 && <BalanceDetails patientId={patient} />}
          </View>
        </View>
        {dataToDisplay.map((row) => (
          <View key={`balance${row.id}`} style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.text}>{row.fullname}</Text>
            </View>

            <View>
              <Text style={{ ...styles.text, color: "#FA5252" }}>
                {row.balance / 100} €
              </Text>
              <BalanceDetails patientId={row.id} />
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  addReminder: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  patientSearch: {
    flex: 1,
    marginRight: 20,
  },
  formItem: {
    marginVertical: 10,
  },
  item: {
    backgroundColor: "rgb(40, 40, 40)",
    marginVertical: 5,
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
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
