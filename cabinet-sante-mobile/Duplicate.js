import { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import {
  Modal,
  Portal,
  Card,
  IconButton,
  TextInput,
  Button,
  Snackbar,
  Text,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import {
  displayDateInFrench,
  displayFullDate,
  displayTime,
} from "./Functions/Functions";
import { usePatients } from "./contexts/PatientsContext";
import { useConfig } from "./contexts/ConfigContext";

export default function Duplicate({ appointmentId, open, setOpen }) {
  // context
  const appointments = usePatients().appointments.filter(
    (app) => app.appointmentId === appointmentId
  );
  const appointmentTypes = useConfig().appointmentTypes;

  const thisAppointment = appointments[0];
  const appointmentType = appointmentTypes.find(
    (e) => e.id === thisAppointment.idType
  )?.type;

  // state
  const [loading, setLoading] = useState(false);
  // date picker
  const [datePicker, setDatePicker] = useState(false);
  const [date, setDate] = useState(
    dayjs(thisAppointment.start).add(7, "days").toDate()
  );
  // snackbar
  const [snackbarMsg, setSnackbarMsg] = useState("Test");
  const [showSnackbar, setShowSnackbar] = useState(false);
  // start picker
  const [startPicker, setStartPicker] = useState(false);
  const [start, setStart] = useState(new Date(thisAppointment.start));

  // end picker
  const [endPicker, setEndPicker] = useState(false);
  const [end, setEnd] = useState(new Date(thisAppointment.end));

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

  function submitForm() {
    const check = checkValues();
    if (check.error) {
      // we display the error in the snackbar
      setSnackbarMsg(check.message);
      setShowSnackbar(true);
    } else {
      setLoading(true);
    }
    setLoading(false);
  }

  function checkValues() {
    // check that:

    // end is after start
    if (end < start) {
      return {
        error: true,
        message:
          "La date de fin du rendez-vous doit être antérieure à la date de début.",
      };
    }

    return { error: false };
  }

  return (
    <>
      <Portal>
        <Modal visible={open} onDismiss={() => setOpen(false)}>
          <Card style={styles.items}>
            <Card.Title
              titleStyle={styles.cardTitle}
              subtitleStyle={styles.cardTitle}
              title={`Dupliquer`}
              subtitle={`${appointmentType} du ${displayDateInFrench(
                thisAppointment.start
              )}`}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="close"
                  color="lightgray"
                  onPress={() => setOpen(false)}
                />
              )}
            />
            <Card.Content style={styles.cardContent}>
              <View style={styles.searchView}>
                <Pressable
                  onPress={() => setDatePicker(true)}
                  style={{ flex: 1 }}
                >
                  <View pointerEvents="none">
                    <TextInput
                      value={displayFullDate(date)}
                      label="Date du nouveau rendez-vous"
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
              </View>
              <View style={styles.searchView}>
                <Pressable
                  onPress={() => setStartPicker(true)}
                  style={{ flex: 1 }}
                >
                  <View pointerEvents="none">
                    <TextInput
                      style={{ marginRight: 5 }}
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

                <Pressable
                  onPress={() => setEndPicker(true)}
                  style={{ flex: 1 }}
                >
                  <View pointerEvents="none">
                    <TextInput
                      style={{ marginLeft: 5 }}
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
              <Button
                loading={loading}
                mode="contained"
                onPress={submitForm}
                style={{ marginTop: 10 }}
              >
                Confirmer
              </Button>
            </Card.Content>
          </Card>
        </Modal>
        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          duration={5000}
          style={{ backgroundColor: "#E3FAFC" }}
        >
          {" "}
          <Text style={{ color: "black" }}>{snackbarMsg}</Text>
        </Snackbar>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  searchView: {
    flexDirection: "row",
    marginVertical: 10,
  },
  cardTitle: {
    color: "lightgray",
  },
  items: {
    backgroundColor: "rgb(40, 40, 40)",
    margin: 20,
  },
  searchBar: {
    flex: 1,
  },
  text: {
    color: "white",
    marginVertical: 15,
    fontSize: 16,
  },
});
