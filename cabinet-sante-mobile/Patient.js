import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Card,
  Avatar,
  Paragraph,
  IconButton,
  Switch,
  TextInput,
  Text,
} from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { useConfig } from "./contexts/ConfigContext";

export default function Patient({ patient, setPatient, removePatient, multi }) {
  // state
  const [showDropDown, setShowDropDown] = useState(false);
  const [showDropDown2, setShowDropDown2] = useState(false);

  // data from context
  const patientTypes = useConfig().patientTypes;
  const types = patientTypes.map((e) => {
    return { label: e.type, value: e.id };
  });
  const payementMethods = useConfig().parameters.filter(
    (e) => e.name === "payementMethod"
  );
  const payementMethodsList = payementMethods.map((e) => {
    return { label: e.value, value: e.id };
  });

  function setPresent(bool) {
    setPatient({ ...patient, present: bool });
  }

  function setPayed(bool) {
    setPatient({ ...patient, payed: bool });
  }

  function setPatientType(value) {
    setPatient({ ...patient, patientType: value });
  }

  function setPrice(value) {
    setPatient({ ...patient, price: value });
  }

  function setPayementMethod(value) {
    setPatient({ ...patient, payementMethod: value });
  }

  return (
    <Card style={styles.items}>
      <Card.Title
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardTitle}
        title={patient.fullname}
      />
      <Card.Content style={styles.cardContent}>
        <View style={styles.switchView}>
          <Switch
            value={patient.present}
            onValueChange={setPresent}
            color={styles.switchColor.color}
          />
          <Paragraph style={styles.paragrah}>Présent</Paragraph>
        </View>
        <View style={styles.switchView}>
          <Switch
            value={patient.payed}
            onValueChange={setPayed}
            color={styles.switchColor.color}
          />
          <Paragraph style={styles.paragrah}>Payé</Paragraph>
        </View>
        <IconButton
          icon="delete"
          color="#ffffff"
          onPress={() => removePatient(patient.id)}
        />
      </Card.Content>
      {!multi && ( // If it's a solo appointment, we require some extra information on the patient : patientType, price, and payement method (if payed)
        <Card.Content style={styles.cardContent}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 2 }}>
              <DropDown
                mode={"outlined"}
                visible={showDropDown}
                showDropDown={() => setShowDropDown(true)}
                onDismiss={() => setShowDropDown(false)}
                value={patient.patientType}
                setValue={setPatientType}
                list={types}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 20 }}>
              <TextInput
                label="Prix (€)"
                value={patient.price}
                onChangeText={(text) => setPrice(text)}
                type="outlined"
                style={styles.priceInput}
              />
            </View>
          </View>
        </Card.Content>
      )}
      {patient.payed && !multi && (
        <Card.Content style={styles.cardContent}>
          <View style={{ flex: 1, marginTop: 10 }}>
            <DropDown
              mode={"outlined"}
              visible={showDropDown2}
              showDropDown={() => setShowDropDown2(true)}
              onDismiss={() => setShowDropDown2(false)}
              value={patient.payementMethod}
              setValue={setPayementMethod}
              list={payementMethodsList}
            />
          </View>
        </Card.Content>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 16,
  },
  items: {
    backgroundColor: "rgb(40, 40, 40)",
    marginVertical: 5,
  },
  paragrah: {
    color: "#ffffff",
    marginLeft: 10,
  },
  switchView: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  switchColor: {
    color: "#1098AD",
  },
  priceInput: {
    backgroundColor: "white",
    borderRadius: 5,
    height: 56,
    marginTop: 7,
  },
});
