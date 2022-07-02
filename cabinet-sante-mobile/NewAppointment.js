import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Title, TextInput, Button, Text, IconButton } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import Patient from "./Patient";
import PatientSearch from "./PatientSearch";
import { displayTime } from "./Functions/Functions";
import dayjs from "dayjs";

function BottomBar({ remove, duplicate, submitForm }) {
  const size = 26;
  const color = "white";
  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarButton}>
        <IconButton
          icon="delete"
          color={color}
          size={size}
          onPress={() => console.log("delete")}
        />
      </View>
      <View style={styles.bottomBarButton}>
        <IconButton
          icon="content-copy"
          color={color}
          size={size}
          onPress={() => console.log("copy")}
        />
      </View>
      <View style={styles.bottomBarButton}>
        <IconButton
          icon="check"
          color={color}
          size={size}
          onPress={() => submitForm()}
        />
      </View>
    </View>
  );
}

export default function NewAppointment() {
  const [title, setTitle] = useState("");

  const [type, setType] = useState("");
  const [datePicker, setDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [start, setStart] = useState(new Date());
  const [startPicker, setStartPicker] = useState(false);
  const [end, setEnd] = useState(dayjs(start).add(60, "minutes").toDate());
  const [endPicker, setEndPicker] = useState(false);
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

  function onDateSelected(event, value) {
    setDate(value);
    setDatePicker(false);
  }

  function onStartSelected(event, value) {
    setStart(value);
    setEnd(dayjs(value).add(60, "minutes").toDate());
    setStartPicker(false);
  }

  function onEndSelected(event, value) {
    setEnd(value);
    setEndPicker(false);
  }

  return (
    <>
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
            <Pressable onPress={() => setDatePicker(true)}>
              <View pointerEvents="none">
                <TextInput
                  style={styles.textInput}
                  activeUnderlineColor="#1098AD"
                  value={date.toLocaleDateString("fr-FR")}
                  label="Jour"
                  type="outlined"
                />
              </View>
            </Pressable>
            {datePicker && (
              <DateTimePicker
                value={date}
                mode={"date"}
                display={"default"}
                is24Hour={true}
                onChange={onDateSelected}
              />
            )}
            <View style={styles.timeRange}>
              <Pressable
                onPress={() => setStartPicker(true)}
                style={{ flex: 1 }}
              >
                <View pointerEvents="none" style={{ flex: 1 }}>
                  <TextInput
                    style={{ ...styles.timeInput, marginRight: 5 }}
                    activeUnderlineColor="#1098AD"
                    value={displayTime(start)}
                    label="Heure de début"
                    type="outlined"
                  />
                </View>
              </Pressable>

              {startPicker && (
                <DateTimePicker
                  value={start}
                  mode={"time"}
                  display={"default"}
                  is24Hour={true}
                  onChange={onStartSelected}
                />
              )}

              <Pressable onPress={() => setEndPicker(true)} style={{ flex: 1 }}>
                <View pointerEvents="none" style={{ flex: 1 }}>
                  <TextInput
                    style={{ ...styles.timeInput, marginLeft: 5 }}
                    activeUnderlineColor="#1098AD"
                    value={displayTime(end)}
                    label="Heure de fin"
                    type="outlined"
                  />
                </View>
              </Pressable>

              {endPicker && (
                <DateTimePicker
                  value={end}
                  mode={"time"}
                  display={"default"}
                  is24Hour={true}
                  onChange={onEndSelected}
                />
              )}
            </View>
            <View style={styles.button}>
              <PatientSearch
                patientsList={patientSearchList}
                addPatient={addPatient}
              />
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
      <BottomBar submitForm={submitForm} />
    </>
  );
}

const styles = StyleSheet.create({
  timeRange: {
    flexDirection: "row",
  },
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
  timeInput: {
    marginVertical: 10,
    flex: 1,
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
  bottomBar: {
    backgroundColor: "#1098AD",
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomBarButton: {
    flex: 1,
    backgroundColor: "#1098AD",
    flexDirection: "row",
    justifyContent: "center",
  },
});
