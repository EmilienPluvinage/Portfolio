import { ScrollView, View, StyleSheet, Text } from "react-native";
import { IconButton, Button, TextInput } from "react-native-paper";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { useState } from "react";
import DropDown from "react-native-paper-dropdown";
import { REACT_APP_API_DOMAIN } from "@env";
import { useLogin } from "./contexts/AuthContext";
import PatientSearch from "./PatientSearch";

export default function Reminders() {
  // Data from context
  const reminders = usePatients().reminders;
  const patients = usePatients().patients;
  const patientsList = patients.map((patient) => {
    return { fullname: patient.fullname, id: patient.id };
  });
  patientsList.sort((a, b) => a.label > b.label);
  const token = useLogin().token;
  const updateContext = useUpdatePatients().update;

  // State
  const [description, setDescription] = useState("");
  const [patient, setPatient] = useState(0);
  const [loading, setLoading] = useState(false);

  async function addReminder() {
    if (patient !== 0 && description !== "") {
      setLoading(true);
      // we update the dabase
      try {
        const fetchResponse = await fetch(
          REACT_APP_API_DOMAIN + "/NewReminder",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              patientId: patient,
              description: description,
              token: token,
            }),
          }
        );
        const res = await fetchResponse.json();
        console.log(res);
        if (res.success) {
          // we clear the form, update the context and display a notification
          await updateContext(token);
          setDescription("");

          setLoading(false);
        }
      } catch (e) {
        return e;
      }
    }
  }

  async function removeReminder(reminderId) {
    try {
      const fetchResponse = await fetch(
        REACT_APP_API_DOMAIN + "/RemoveReminder",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: reminderId,
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      if (res.success) {
        await updateContext(token);
      } else {
        console.error(res.error);
      }
    } catch (e) {
      return e;
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
            <TextInput
              style={styles.formItem}
              label="Description"
              value={description}
              onChangeText={(text) => setDescription(text)}
              type="outlined"
            />
            <PatientSearch
              patientsList={patientsList}
              addPatient={selectPatient}
              multi={false}
              patientId={patient}
              patients={patients}
            />
            <Button
              style={{ marginTop: 15 }}
              mode="contained"
              onPress={() => addReminder()}
              loading={loading}
            >
              Ajouter un rappel
            </Button>
          </View>
        </View>
        {reminders.map((reminder) => (
          <View key={`reminder${reminder.id}`} style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.text}>
                {
                  patients.find((patient) => patient.id === reminder.patientId)
                    ?.fullname
                }{" "}
                : {reminder.description}
              </Text>
            </View>
            <IconButton
              icon="delete"
              color="#ffffff"
              onPress={() => removeReminder(reminder.id)}
            />
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  addReminder: {
    flex: 1,
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
