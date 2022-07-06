import { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Title, TextInput, Text, Button, Snackbar } from "react-native-paper";
import { REACT_APP_API_DOMAIN } from "@env";
import { useLogin } from "./contexts/AuthContext";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { useConfig } from "./contexts/ConfigContext";
import PatientSearch from "./PatientSearch";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  displayFullDate,
  displayDateInFrench,
  newPayement,
  newSubscription,
} from "./Functions/Functions";
import DropDown from "react-native-paper-dropdown";

export default function NewPatient() {
  // data from context
  const patients = usePatients().patients;
  const appointments = usePatients().appointments;
  const appointmentTypes = useConfig().appointmentTypes;
  const packages = useConfig().packages;
  const token = useLogin().token;
  const patientsList = patients.map((patient) => {
    return { fullname: patient.fullname, id: patient.id };
  });
  const updateContext = useUpdatePatients().update;

  const payementMethods = useConfig().parameters.filter(
    (e) => e.name === "payementMethod"
  );
  const payementMethodsList = payementMethods.map((e) => {
    return { label: e.value, value: e.id };
  });

  // state
  const [showDropDown, setShowDropDown] = useState(false);
  const [showDropDown2, setShowDropDown2] = useState(false);
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [payementMethod, setPayementMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [patient, setPatient] = useState(0);

  // date picker
  const [datePicker, setDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  // reasons options

  const myAppointments = appointments.reduce(
    (acc, item) =>
      item.patientId !== patient
        ? acc
        : acc.concat({
            payed: item.payed,
            id: item.id,
            defaultValue: item.price,
            defaultDate: item.start,
            value:
              appointmentTypes.find((e) => e.id === item.idType)?.type +
              " " +
              displayDateInFrench(new Date(item.start)),
          }),
    []
  );

  const others = [
    { value: "Autre", defaultValue: "", type: "other", payed: 0 },
  ];
  const reasonOptions = others
    .concat(
      packages
        .map((e) => {
          return {
            payed: 0,
            value: e.package,
            defaultValue: e.price,
            type: "package",
            packageId: e.id,
          };
        })
        .concat(
          myAppointments.map((e) => {
            return {
              payed: e.payed,
              appointmentId: e.id,
              value: e.value,
              defaultValue: e.defaultValue,
              defaultDate: e.defaultDate,
              type: "appointment",
            };
          })
        )
    )
    .map((element, index) => ({ ...element, index: index }));

  const reasonOptionsList = reasonOptions
    .filter((e) => e.payed === 0)
    .map((e) => ({ label: e.value, value: e.index }))
    .slice(0, 20);

  function selectPatient(patient) {
    setPatient(patient.id);
  }

  function onDateSelected(event, value) {
    setDatePicker(false);
    setDate(value);
  }

  function checkValues(values) {
    if (values.reason === undefined) {
      return {
        check: false,
        message: "Merci de sélectionner un motif pour le paiement.",
      };
    }
    if (!values.amount || parseInt(values.amount) === 0) {
      return {
        check: false,
        message: "Merci choisir une valeur valide pour le montant",
      };
    }

    return { check: true, message: "OK" };
  }
  async function submitForm() {
    // add checks
    const check = checkValues({ reason: reason, amount: amount });
    if (check.check) {
      setLoading(true);
      // we verify whether the reason is an event or a package
      // if it's other or an event
      const option = reasonOptions.find((e) => e.index === reason);
      const method = payementMethods.find(
        (e) => e.id === payementMethod
      )?.value;
      let result = "";
      if (reason === 0 || option?.type === "appointment") {
        result = await newPayement(
          option.appointmentId ? option.appointmentId : 0,
          method,
          amount * 100,
          date,
          patient,
          token
        );
      } else {
        // it's a package
        result = await newSubscription(
          option.packageId,
          method,
          amount * 100,
          date,
          patient,
          token
        );
      }
      if (result.success) {
        await updateContext(token);
        setPatient(0);
        setReason("");
        setAmount("");
        setPayementMethod("");
        setDate(new Date());
        setSnackbarMsg("Payement ajouté.");
        setShowSnackbar(true);
      } else {
        setSnackbarMsg(result.error);
        setShowSnackbar(true);
      }
    } else {
      setSnackbarMsg(check.message);
      setShowSnackbar(true);
    }
    setLoading(false);
  }

  function changeReason(value) {
    const option = reasonOptions.find((e) => e.index === value);
    if (value !== 0) {
      setAmount((option.defaultValue / 100).toString());
      if (option.type === "appointment") {
        // we also update the date
        setDate(new Date(option.defaultDate));
      }
      setReason(value);
    }
  }
  return (
    <>
      <View style={styles.item}>
        <Title style={styles.text}>Nouveau Paiement</Title>
        <PatientSearch
          patientsList={patientsList}
          addPatient={selectPatient}
          multi={false}
          patientId={patient}
        />
        {patient !== 0 && (
          <View>
            <View style={{ marginBottom: 5 }}>
              <DropDown
                mode={"outlined"}
                visible={showDropDown}
                showDropDown={() => setShowDropDown(true)}
                onDismiss={() => setShowDropDown(false)}
                value={reason}
                placeholder={"Motif du paiement"}
                setValue={changeReason}
                list={reasonOptionsList}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <TextInput
                  style={styles.priceInput}
                  label="Montant (€)"
                  value={amount}
                  onChangeText={(text) => setAmount(text)}
                  type="outlined"
                />
              </View>
              <View style={{ flex: 1 }}>
                <DropDown
                  mode={"outlined"}
                  visible={showDropDown2}
                  showDropDown={() => setShowDropDown2(true)}
                  onDismiss={() => setShowDropDown2(false)}
                  value={payementMethod}
                  placeholder={"Moyen de Paiement"}
                  setValue={setPayementMethod}
                  list={payementMethodsList}
                />
              </View>
            </View>
            <Pressable onPress={() => setDatePicker(true)}>
              <View pointerEvents="none">
                <TextInput
                  style={{ marginVertical: 15 }}
                  value={displayFullDate(date)}
                  label="Date du Paiement"
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

            <Button
              loading={loading}
              mode="contained"
              onPress={() => submitForm()}
            >
              AJOUTER
            </Button>
          </View>
        )}
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
    alignItems: "stretch",
  },
  priceInput: {
    borderRadius: 5,
    height: 56,
    marginTop: 7,
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
