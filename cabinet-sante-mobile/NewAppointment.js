import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Title, TextInput, RadioButton, Button } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import Patient from "./Patient";
import PatientSearch from "./PatientSearch";

export default function NewAppointment() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [timeRange, setTimeRange] = useState("");
  // list of patients being in that appointment. Empty if new appointment, otherwise initialized with context data.
  const [patientsInAppointment, setPatientsInAppointment] = useState([]);

  const [showDropDown, setShowDropDown] = useState(false);
  const types = [
    { label: "Ostéopathie", value: "Ostéopathie" },
    { label: "Cours Tapis", value: "Cours Tapis" },
  ];

  const patientsList = [
    { id: 1, fullname: "Emilien Pluvinage" },
    { id: 2, fullname: "Raphael Pluvinage" },
    { id: 3, fullname: "Mathieu Pluvinage" },
    { id: 4, fullname: "Jean Pluvinage" },
    { id: 5, fullname: "Elsa Theillet" },
    { id: 6, fullname: "Flora Theillet" },
    { id: 7, fullname: "Julia Theillet" },
    { id: 8, fullname: "Chantal Escot" },
    { id: 9, fullname: "Florence Jacquet" },
    { id: 10, fullname: "Charles Theillet" },
  ];

  // list of patients to pass to the search modal. We exclude patients that have already been selected.
  const patientSearchList = patientsList.filter(
    (patient) =>
      patientsInAppointment.findIndex((e) => e.id === patient.id) === -1
  );

  function submitForm() {
    // add checks
    console.log("submitted");
  }

  function addPatient(patient) {
    setPatientsInAppointment((prev) => prev.concat([patient]));
  }

  function removePatient(patientId) {
    setPatientsInAppointment((prev) =>
      prev.filter((patient) => patient.id !== patientId)
    );
  }

  return (
    <ScrollView>
      <View style={styles.item}>
        <Title style={styles.text}>Nouvelle Consultation</Title>
        <View>
          <TextInput
            style={styles.textInput}
            activeUnderlineColor="#1098AD"
            label="Titre"
            value={title}
            onChangeText={(text) => setTitle(text)}
            type="outlined"
          />
          <View style={styles.dropdown}>
            <DropDown
              mode={"outlined"}
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              value={type}
              setValue={setType}
              list={types}
              activeColor="#1098AD"
            />
          </View>
          <TextInput
            style={styles.textInput}
            activeUnderlineColor="#1098AD"
            label="Jour"
            value={date}
            onChangeText={(text) => setDate(text)}
            type="outlined"
          />
          <TextInput
            style={styles.textInput}
            activeUnderlineColor="#1098AD"
            label="Heure"
            value={timeRange}
            onChangeText={(text) => setTimeRange(text)}
            type="outlined"
          />

          <View style={styles.button}>
            <PatientSearch
              patientsList={patientSearchList}
              addPatient={addPatient}
            />
          </View>
          <View style={styles.button}>
            <Button
              color="#1098AD"
              mode="contained"
              onPress={() => submitForm()}
            >
              valider
            </Button>
          </View>
        </View>
      </View>
      {patientsInAppointment.map((patient) => (
        <Patient
          key={"Patient" + patient.id}
          patientId={patient.id}
          fullname={patient.fullname}
          removePatient={removePatient}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "rgb(40, 40, 40)",
    marginVertical: 5,
    borderRadius: 5,
    padding: 10,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    padding: 5,
  },
  textInput: {
    marginVertical: 10,
  },
  radioButtonGroup: {
    flexDirection: "row",
    marginVertical: 10,
  },
  radioButton: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  button: { marginVertical: 10 },
  dropdown: {
    marginVertical: 10,
  },
});
