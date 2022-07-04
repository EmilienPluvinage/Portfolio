import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  Title,
  TextInput,
  Button,
  Text,
  IconButton,
  Snackbar,
} from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import Patient from "./Patient";
import PatientSearch from "./PatientSearch";
import { displayTime, displayFullDate } from "./Functions/Functions";
import dayjs from "dayjs";
import { useConfig } from "./contexts/ConfigContext";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { REACT_APP_API_DOMAIN } from "@env";
import { deleteAppointment } from "./Functions/Functions";
import { useLogin } from "./contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

function BottomBar({ appointmentId, submitForm }) {
  const size = 26;
  const color = "white";
  const token = useLogin().token;
  const navigation = useNavigation();
  const updateContext = useUpdatePatients().update;

  async function clickOnDeleteAppointment(id) {
    try {
      const result = await deleteAppointment(id, token, REACT_APP_API_DOMAIN);

      if (result) {
        navigation.navigate("NewAppointment", { appointmentId: 0 });
        // add snackbar update
        await updateContext(token);
      }
    } catch (e) {
      return e;
    }
  }

  return (
    <View style={styles.bottomBar}>
      <View style={styles.bottomBarButton}>
        <IconButton
          icon="delete"
          color={color}
          size={size}
          onPress={() => clickOnDeleteAppointment(appointmentId)}
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

export default function NewAppointment({ route }) {
  // STATE
  // Appointment Id passed as a parameter
  const [appointmentId, setAppointmentId] = useState(0);
  // Form values
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  // list of patients being in that appointment. Empty if new appointment, otherwise initialized with context data.
  const [patientsInAppointment, setPatientsInAppointment] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);
  // date picker
  const [datePicker, setDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  // time pickers
  const [start, setStart] = useState(new Date());
  const [startPicker, setStartPicker] = useState(false);
  const [end, setEnd] = useState(dayjs(start).add(60, "minutes").toDate());
  const [endPicker, setEndPicker] = useState(false);
  // snackbar
  const [snackbarMsg, setSnackbarMsg] = useState("Test");
  const [showSnackbar, setShowSnackbar] = useState(false);

  // data from context
  const appointmentTypes = useConfig().appointmentTypes;
  const types = appointmentTypes.map((e) => {
    return { label: e.type, value: e.type };
  });
  const patients = usePatients().patients;
  const patientsList = patients.map((e) => {
    return { id: e.id, fullname: e.fullname };
  });
  const appointments = usePatients().appointments;

  useEffect(() => {
    if (appointmentId !== route.params.appointmentId) {
      setAppointmentId(route.params.appointmentId);
      // it means we're loading a new page
      // either it's a creation and we'll make sure to empty all the fields to start with
      // or it's a modification and we'll pre-fill the form with data from our contexts
      if (route.params.appointmentId === 0) {
        // create
        setTitle("");
        setType("");
        setStart(new Date());
        setEnd(dayjs(new Date()).add(60, "minutes").toDate());
        setDate(new Date());
        setPatientsInAppointment([]);
      } else {
        // update
        const appointment = appointments.find(
          (e) => e.appointmentId === route.params.appointmentId
        );
        setTitle(appointment.title);
        setType(
          appointmentTypes.find((e) => e.id === appointment.idType)?.type
        );
        setStart(new Date(appointment.start));
        setEnd(new Date(appointment.end));
        setDate(new Date(appointment.start));

        // now we need to get the list of patients that are present in our appointment

        let filteredPatients = appointments.filter(
          (p) => p.appointmentId === route.params.appointmentId
        );
        filteredPatients = filteredPatients.map((patient) => {
          const thisPatient = patients.find((e) => e.id === patient.patientId);
          return { id: patient.patientId, fullname: thisPatient?.fullname };
        });
        setPatientsInAppointment(filteredPatients);
      }
    }
  }, [route, appointmentId]);

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
          <Title style={styles.text}>
            {appointmentId === 0
              ? "Nouvelle Consultation"
              : "Modifier une Consultation"}
          </Title>
          <View>
            <TextInput
              style={styles.textInput}
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
                  value={displayFullDate(date)}
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
                multi={true}
              />
            </View>
            <Button mode="contained" onPress={() => setShowSnackbar(true)}>
              Show snackbar
            </Button>
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
      <View>
        <View>
          <Snackbar
            visible={showSnackbar}
            onDismiss={() => setShowSnackbar(false)}
            duration={5000}
            style={{ backgroundColor: "#E3FAFC" }}
          >
            <Text style={{ color: "black" }}>{snackbarMsg}</Text>
          </Snackbar>
        </View>
        <View>
          <BottomBar appointmentId={appointmentId} submitForm={submitForm} />
        </View>
      </View>
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
