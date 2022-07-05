import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Title, TextInput, Text, Button, Snackbar } from "react-native-paper";
import { REACT_APP_API_DOMAIN } from "@env";
import { useLogin } from "./contexts/AuthContext";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import PatientSearch from "./PatientSearch";

export default function NewPatient() {
  // data from context
  const patients = usePatients().patients;
  const token = useLogin().token;
  const patientsList = patients.map((patient) => {
    return { fullname: patient.fullname, id: patient.id };
  });
  const updateContext = useUpdatePatients().update;

  // state
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [payementMethod, setPayementMethod] = useState("");
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [patient, setPatient] = useState(0);

  function selectPatient(patient) {
    setPatient(patient.id);
  }

  function checkValues(values) {
    return { check: true, message: "OK" };
  }

  async function submitForm() {
    // add checks
    const check = checkValues();
    if (check.check) {
      setLoading(true);
    } else {
      setSnackbarMsg(check.message);
      setShowSnackbar(true);
    }
    setLoading(false);
  }

  return (
    <>
      <View style={styles.item}>
        <Title style={styles.text}>Nouveau Paiement</Title>
        <View style={styles.patientSearch}>
          <PatientSearch
            patientsList={patientsList}
            addPatient={selectPatient}
            multi={false}
            patientId={patient}
          />
        </View>
        <View>
          <TextInput
            style={styles.textInput}
            label="Dropdown motif"
            value={reason}
            onChangeText={(text) => setReason(text)}
            type="outlined"
          />
          <TextInput
            style={styles.textInput}
            label="Montant"
            value={amount}
            onChangeText={(text) => setAmount(text)}
            type="outlined"
          />
          <TextInput
            style={styles.textInput}
            label="Moyen de paiement"
            placeholder="Dropdown payement method"
            value={payementMethod}
            onChangeText={(text) => setPayementMethod(text)}
            type="outlined"
          />
          <TextInput
            style={styles.textInput}
            label="Date du paiement"
            placeholder="DatePicker"
            value={date}
            onChangeText={(text) => setDate(text)}
            type="outlined"
          />

          <Button
            loading={loading}
            mode="contained"
            onPress={() => submitForm()}
          >
            AJOUTER
          </Button>
        </View>
      </View>
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={5000}
        style={{ backgroundColor: "#E3FAFC" }}
      >
        <Text style={{ color: "black" }}>{snackbarMsg}</Text>
      </Snackbar>
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
  patientSearch: {
    flex: 1,
    marginRight: 20,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    padding: 5,
  },
  textInput: {
    marginVertical: 10,
  },
  button: { marginVertical: 10 },
});
