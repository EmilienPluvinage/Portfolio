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
import {
  deleteAppointment,
  concatenateDateTime,
  setAutomaticPrice,
  datePlusTime,
} from "./Functions/Functions";
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
      console.error(e);
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
  const token = useLogin().token;
  const priceScheme = useConfig().priceScheme;
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

  async function createNewAppointment(
    title,
    appointmentTypeId,
    start,
    end,
    patientsInAppointment
  ) {
    console.log(start);
    console.log(end);
    // try {
    //   const fetchResponse = await fetch(REACT_APP_API_DOMAIN + "/NewEvent", {
    //     method: "POST",
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       important: false,
    //       start: new Date(start),
    //       end: new Date(end),
    //       title: title,
    //       comments: "",
    //       idType: appointmentTypeId,
    //       token: token,
    //     }),
    //   });
    //   const res = await fetchResponse.json();
    //   if (res.success) {
    //     const eventId = res.id;
    //     // Now that the event has been created, we need to add all the participants
    //     const findPackage = (x) => patients.find((e) => e.id === x)?.packageId;

    //     // we loop through all the patients in our appointment (at least 1)
    //     for (const element of patientsInAppointment) {
    //       let priceSetByUser = true;
    //       const index = patientsInAppointment.findIndex(
    //         (e) => e.id === element.id
    //       );
    //       let packageId = findPackage(element.id);
    //       packageId =
    //         packageId === null || packageId === undefined ? 0 : packageId;

    //       if (
    //         appointmentTypes.find((e) => e.id === appointmentTypeId)?.multi !==
    //         0
    //       ) {
    //         // it's a multi appointment, which means we have to calculate the price automatically since there was no input for it
    //         priceSetByUser = false;
    //         patientsInAppointment[index].price = setAutomaticPrice(
    //           priceScheme,
    //           element.patientType,
    //           appointmentTypeId,
    //           packageId
    //         );
    //       }
    //     }

    //     // then we add all our participants (or non-participants)
    //     let queries = [];
    //     for (let i = 0; i < patientsInAppointment.length; i++) {
    //       queries.push(
    //         newParticipant(
    //           patientsInAppointment[i],
    //           eventId,
    //           priceSetByUser,
    //           start,
    //           patientsInAppointment[i].present
    //         )
    //       );
    //     }

    //     await Promise.all(queries);

    //     return { success: true, eventId: eventId };
    //   } else {
    //     return { success: false };
    //   }
    // } catch (e) {
    //   console.error(e);
    // }
  }

  async function newParticipant(
    thisPatient,
    eventId,
    priceSetByUser,
    date,
    present
  ) {
    const fetchResponse = await fetch(
      REACT_APP_API_DOMAIN + preset ? "/NewParticipant" : "/NewAbsent",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: thisPatient.id,
          appointmentId: eventId,
          size: 0,
          weight: 0,
          EVAbefore: 0,
          EVAafter: 0,
          reasonDetails: "",
          tests: "",
          treatment: "",
          remarks: "",
          drawing: "",
          patientType: thisPatient.patientType,
          token: token,
          price: thisPatient.price * 100,
          priceSetByUser: priceSetByUser,
          payed: thisPatient.payed,
        }),
      }
    );
    const res = await fetchResponse.json();
    if (res.success) {
      // now either it's been payed, which means we need to add a new payement
      if (thisPatient.payed) {
        const res2 = await newPayement(
          eventId,
          thisPatient.payementMethod,
          thisPatient.price,
          date,
          thisPatient.id
        );
        return res2;
      } else {
        // or we can just return success
        return { success: true };
      }
    }
  }

  async function newPayement(eventId, method, price, date, patientId) {
    const fetchResponse = await fetch(
      REACT_APP_API_DOMAIN + "/AddNewPayement",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          eventId: eventId,
          method: method,
          amount: price * 100,
          date: dayjs(date).add(12, "hours").toDate(),
          patientId: patientId,
        }),
      }
    );
    const res = await fetchResponse.json();
    return res;
  }

  async function updateAppointment(
    title,
    appointmentTypeId,
    start,
    end,
    patients
  ) {
    console.log(patients);
    if (appointmentTypes.find((e) => e.id === appointmentTypeId)?.multi === 0) {
      // it's a solo appointment
    } else {
      // it's a multi appoitment
    }
  }

  function checkValues() {
    // check that:
    // appointment type exists
    if (appointmentTypes.findIndex((e) => e.type === type) === -1) {
      return {
        error: true,
        message: "Merci de sélectionner le type de consultation.",
      };
    }
    // end is after start
    if (end < start) {
      return {
        error: true,
        message:
          "La date de fin du rendez-vous doit être antérieure à la date de début.",
      };
    }
    // patient.length is not zero
    if (patientsInAppointment.length === 0) {
      return {
        error: true,
        message: "Merci de sélectionner au moins un patient",
      };
    }

    return { error: false };
  }

  async function submitForm() {
    const check = checkValues();
    if (check.error) {
      // we display the error in the snackbar
      setSnackbarMsg(check.message);
      setShowSnackbar(true);
    } else {
      // No errors, we carry on.
      const eventStart = datePlusTime(date, start);
      const eventEnd = datePlusTime(date, end);
      const appointmentTypeId = appointmentTypes.find(
        (e) => e.type === type
      ).id;
      if (appointmentId === 0) {
        await createNewAppointment(
          title,
          appointmentTypeId,
          eventStart,
          eventEnd,
          patientsInAppointment
        );
      } else {
        await updateAppointment(
          title,
          appointmentTypeId,
          eventStart,
          eventEnd,
          patientsInAppointment
        );
      }
    }
  }

  function addPatient(patient) {
    setPatientsInAppointment((prev) =>
      prev.concat([
        {
          ...patient,
          present: true,
          payed: false,
          patientType: 0,
          price: "",
          payementMethod: 0,
        },
      ])
    );
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

  function changeType(value) {
    setType(value);
    // also, we check if the new type is a solo appointment type
    if (appointmentTypes.find((e) => e.type === value)?.multi === 0) {
      setPatientsInAppointment((prev) => prev.slice(0, 1));
    }
  }

  function setPatient(thisPatient) {
    // that function is passed to the Patient component so that it can update the patients that have been selected.
    const index = patientsInAppointment.findIndex(
      (e) => e.id === thisPatient.id
    );
    if (index !== -1) {
      const tempArray = patientsInAppointment.slice();
      tempArray[index] = thisPatient;
      setPatientsInAppointment(tempArray);
    } else {
      console.error("Patient ID does not exist.");
    }
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
                setValue={changeType}
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
              {(patientsInAppointment.length === 0 ||
                appointmentTypes.find((e) => e.type === type)?.multi !== 0) && (
                <PatientSearch
                  patientsList={patientSearchList}
                  addPatient={addPatient}
                  multi={true}
                />
              )}
            </View>
          </View>
        </View>
        {patientsInAppointment.map((patient) => (
          <Patient
            key={"Patient" + patient.id}
            patient={patient}
            setPatient={setPatient}
            removePatient={removePatient}
            multi={appointmentTypes.find((e) => e.type === type)?.multi !== 0}
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
