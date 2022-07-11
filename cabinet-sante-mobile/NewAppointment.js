import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  Title,
  TextInput,
  Button,
  Text,
  IconButton,
  Snackbar,
  Portal,
  Modal,
  ActivityIndicator,
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
  newPayement,
  setAutomaticPrice,
  datePlusTime,
} from "./Functions/Functions";
import { useLogin } from "./contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import Duplicate from "./Duplicate";
import Confirmation from "./Confirmation";

function Loader({ visible }) {
  const containerStyle = {
    backgroundColor: "transparent",
    padding: 20,
    flex: 1,
  };

  return (
    <Portal>
      <Modal visible={visible} contentContainerStyle={containerStyle}>
        <ActivityIndicator animating={visible} size={100} />
      </Modal>
    </Portal>
  );
}

function BottomBar({
  appointmentId,
  submitForm,
  setSnackbarMsg,
  setShowSnackbar,
}) {
  const size = 26;
  const color = "white";
  const token = useLogin().token;
  const navigation = useNavigation();
  const updateContext = useUpdatePatients().update;
  const [duplicate, setDuplicate] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [callback, setCallback] = useState();

  async function removeAppointment(id) {
    try {
      const result = await deleteAppointment(id, token, REACT_APP_API_DOMAIN);

      if (result) {
        navigation.navigate("NewAppointment", { appointmentId: 0 });
        // add snackbar update
        setSnackbarMsg("Rendez-vous supprimé.");
        setShowSnackbar(true);

        await updateContext(token);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function clickOnDeleteAppointment(id) {
    setCallback(() => () => removeAppointment(id));
    setConfirmation(true);
  }
  return (
    <>
      {appointmentId !== 0 && (
        <Duplicate
          appointmentId={appointmentId}
          open={duplicate}
          setOpen={setDuplicate}
          setParentSnackBar={setSnackbarMsg}
          showParentSnackbar={setShowSnackbar}
        />
      )}
      <Confirmation
        open={confirmation}
        setOpen={setConfirmation}
        callback={callback}
      />

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
            onPress={() => setDuplicate(true)}
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
    </>
  );
}

export default function NewAppointment({ route, navigation }) {
  // STATE
  // Appointment Id passed as a parameter
  const [appointmentId, setAppointmentId] = useState(0);
  // Form values
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [loader, setLoader] = useState(false);

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
  const payementMethods = useConfig().parameters.filter(
    (e) => e.name === "payementMethod"
  );
  const token = useLogin().token;
  const payements = usePatients().payements;
  const updateContext = useUpdatePatients().update;
  const priceScheme = useConfig().priceScheme;
  const appointmentTypes = useConfig().appointmentTypes;
  const appointmentTypeId = appointmentTypes.find((e) => e.type === type)?.id;
  const patientTypes = useConfig().patientTypes;
  const types = appointmentTypes.map((e) => {
    return { label: e.type, value: e.type };
  });

  const patients = usePatients().patients;
  const patientsList = patients.map((e) => {
    return { id: e.id, fullname: e.fullname };
  });
  const appointments = usePatients().appointments;
  const missedAppointments = usePatients().missedAppointments;

  function resetForm() {
    setAppointmentId(0);
    setTitle("");
    setStart(new Date());
    setEnd(dayjs(new Date()).add(60, "minutes").toDate());
    setDate(new Date());
    setPatientsInAppointment([]);
  }

  function prefillForm(thisId) {
    setAppointmentId(thisId);
    // update
    const appointment = appointments.find((e) => e.appointmentId === thisId);
    setTitle(appointment.title);
    setType(appointmentTypes.find((e) => e.id === appointment.idType)?.type);
    setStart(new Date(appointment.start));
    setEnd(new Date(appointment.end));
    setDate(new Date(appointment.start));

    // now we need to get the list of patients that are present in our appointment
    let filteredPatients = appointments
      .filter((p) => p.appointmentId === thisId)
      .map((element) => {
        return { ...element, present: true };
      });
    // then the list of patients that were absent
    let missedPatients = missedAppointments
      .filter((p) => p.appointmentId === thisId)
      .map((element) => {
        return { ...element, present: false };
      });
    // then we concat both and use the data to update patients in appointments state array
    filteredPatients = filteredPatients
      .concat(missedPatients)
      .map((patient) => {
        const fullname = patients.find(
          (e) => e.id === patient.patientId
        )?.fullname;
        const payementMethod = payements.find(
          (e) => e.eventId === patient.id
        )?.method;
        const payementMethodId = payementMethods.find(
          (e) => e.value === payementMethod
        )?.id;
        return {
          id: patient.patientId,
          fullname: fullname,
          payed: patient.payed === 1,
          price: (patient.price / 100).toString(),
          present: patient.present,
          payementMethod: payementMethodId,
          patientType: patientTypes.find((f) => f.id === patient.patientType)
            ?.type,
        };
      });
    setPatientsInAppointment(filteredPatients);
  }

  // re-setting form whenever someone loads the page by click on the item in the drawer
  useEffect(() => {
    const click = navigation.addListener("drawerItemPress", (e) => {
      // Prevent default behavior!
      e.preventDefault();
      // resets form
      resetForm();
    });

    return click;
  }, [navigation]);

  // loading data based on route.params.appointmentId
  useEffect(() => {
    // it's a modification and we'll pre-fill the form with data from our contexts
    if (route.params.appointmentId !== 0) {
      prefillForm(route.params.appointmentId);
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
    try {
      const fetchResponse = await fetch(REACT_APP_API_DOMAIN + "/NewEvent", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          important: false,
          start: new Date(start),
          end: new Date(end),
          title: title,
          comments: "",
          idType: appointmentTypeId,
          token: token,
        }),
      });
      const res = await fetchResponse.json();
      if (res.success) {
        const eventId = res.id;

        // Now that the event has been created, we need to add all the participants
        const findPackage = (x) => patients.find((e) => e.id === x)?.packageId;

        // we loop through all the patients in our appointment (at least 1)
        for (const element of patientsInAppointment) {
          const index = patientsInAppointment.findIndex(
            (e) => e.id === element.id
          );
          let packageId = findPackage(element.id);
          packageId =
            packageId === null || packageId === undefined ? 0 : packageId;

          if (
            appointmentTypes.find((e) => e.id === appointmentTypeId)?.multi !==
            0
          ) {
            // it's a multi appointment, which means we have to calculate the price automatically since there was no input for it
            patientsInAppointment[index].priceSetByUser = false;
            patientsInAppointment[index].price = setAutomaticPrice(
              priceScheme,
              element.patientType,
              appointmentTypeId,
              packageId
            );
          } else {
            patientsInAppointment[index].priceSetByUser = true;
            patientsInAppointment[index].price *= 100;
          }
        }

        // then we add all our participants (or non-participants)
        let queries = [];
        for (let i = 0; i < patientsInAppointment.length; i++) {
          queries.push(
            newParticipant(
              patientsInAppointment[i],
              eventId,

              start
            )
          );
        }

        await Promise.all(queries);

        return { success: true, eventId: eventId };
      } else {
        return { success: false };
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function newParticipant(thisPatient, eventId, date) {
    const present = thisPatient.present;

    const fetchResponse = await fetch(
      REACT_APP_API_DOMAIN + (present ? "/NewParticipant" : "/NewAbsent"),
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
          price: thisPatient.price,
          priceSetByUser: thisPatient.priceSetByUser,
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
          payementMethods.find((e) => e.id === thisPatient.payementMethod)
            ?.value,
          thisPatient.price,
          date,
          thisPatient.id,
          token
        );
        return res2;
      } else {
        // or we can just return success
        return { success: true };
      }
    }
  }

  async function updateAppointment(
    title,
    appointmentTypeId,
    start,
    end,
    patientsInAppointment
  ) {
    console.log("appointmentId");
    console.log(appointmentId);
    try {
      const fetchResponse = await fetch(REACT_APP_API_DOMAIN + "/UpdateEvent", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          important: false,
          start: new Date(start),
          end: new Date(end),
          title: title,
          comments: "",
          idType: appointmentTypeId,
          token: token,
          appointmentId: appointmentId,
        }),
      });
      const res = await fetchResponse.json();
      if (res.success) {
        // we start by deleting all participants
        const fetchResponse2 = await fetch(
          REACT_APP_API_DOMAIN + "/DeleteAllParticipants",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              important: false,
              start: new Date(start),
              end: new Date(end),
              title: title,
              comments: "",
              idType: appointmentTypeId,
              token: token,
              appointmentId: appointmentId,
            }),
          }
        );
        const res2 = await fetchResponse2.json();

        // Now that the event has been updated, we need to add all the participants
        const findPackage = (x) => patients.find((e) => e.id === x)?.packageId;

        // we loop through all the patients in our appointment (at least 1)
        for (const element of patientsInAppointment) {
          const index = patientsInAppointment.findIndex(
            (e) => e.id === element.id
          );
          let packageId = findPackage(element.id);
          packageId =
            packageId === null || packageId === undefined ? 0 : packageId;

          if (
            appointmentTypes.find((e) => e.id === appointmentTypeId)?.multi !==
            0
          ) {
            // it's a multi appointment, which means we have to calculate the price automatically since there was no input for it
            patientsInAppointment[index].priceSetByUser = false;
            patientsInAppointment[index].price = setAutomaticPrice(
              priceScheme,
              element.patientType,
              appointmentTypeId,
              packageId
            );
          } else {
            patientsInAppointment[index].priceSetByUser = true;
            patientsInAppointment[index].price *= 100;
          }
        }

        // then we add all our participants (or non-participants)
        let queries = [];
        for (let i = 0; i < patientsInAppointment.length; i++) {
          queries.push(
            newParticipant(
              patientsInAppointment[i],
              appointmentId,

              start
            )
          );
        }

        await Promise.all(queries);

        return { success: true };
      } else {
        return { success: false };
      }
    } catch (e) {
      console.error(e);
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
      setLoader(true);
      let message = "";

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
        message = "Le rendez-vous a bien été ajouté.";
      } else {
        await updateAppointment(
          title,
          appointmentTypeId,
          eventStart,
          eventEnd,
          patientsInAppointment
        );
        message = "Le rendez-vous a bien été modifié.";
      }
      await updateContext(token);
      setLoader(false);
      setSnackbarMsg(message);
      setShowSnackbar(true);

      navigation.navigate("NewAppointment", { appointmentId: 0 });
      resetForm();
    }
  }

  function addPatient(patient) {
    // if multi is 0, we also set a price
    let price = "0";
    if (appointmentTypes.find((e) => e.type === type)?.multi === 0) {
      let packageId = patients.find((e) => e.id === patient.id)?.packageId;
      packageId = packageId === null || packageId === undefined ? 0 : packageId;
      price = (
        setAutomaticPrice(
          priceScheme,
          patient.patientType,
          appointmentTypeId,
          packageId
        ) / 100
      ).toString();
    }
    // and then we add our patient to the list
    setPatientsInAppointment((prev) =>
      prev.concat([
        {
          ...patient,
          present: true,
          payed: false,
          patientType: 0,
          price: price,
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
    setDatePicker(false);
    setDate(value);
  }

  function onStartSelected(event, value) {
    setStartPicker(false);
    setStart(value);
    setEnd(dayjs(value).add(60, "minutes").toDate());
  }

  function onEndSelected(event, value) {
    setEndPicker(false);
    setEnd(value);
  }

  function changeType(value) {
    setType(value);

    // also, we check if the new type is a solo appointment type
    if (appointmentTypes.find((e) => e.type === value)?.multi === 0) {
      if (patientsInAppointment.length > 0) {
        let appointmentTypeId = appointmentTypes.find(
          (e) => e.type === value
        )?.id;
        let patientType = patientsInAppointment[0]?.patientType;
        let packageId = patients.find(
          (e) => e.id === patientsInAppointment[0]?.id
        )?.packageId;
        packageId =
          packageId === null || packageId === undefined ? 0 : packageId;
        let price = (
          setAutomaticPrice(
            priceScheme,
            patientType,
            appointmentTypeId,
            packageId
          ) / 100
        ).toString();
        // we remove all other patients, and add a price
        setPatientsInAppointment((prev) => [{ ...prev[0], price: price }]);
      }
    }
  }

  return (
    <>
      <Loader visible={loader} />
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
                placeholder={"Type de Consultation"}
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
            setPatientsInAppointment={setPatientsInAppointment}
            removePatient={removePatient}
            multi={appointmentTypes.find((e) => e.type === type)?.multi !== 0}
            appointmentTypeId={appointmentTypeId}
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
          <BottomBar
            appointmentId={appointmentId}
            submitForm={submitForm}
            setSnackbarMsg={setSnackbarMsg}
            setShowSnackbar={setShowSnackbar}
          />
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
