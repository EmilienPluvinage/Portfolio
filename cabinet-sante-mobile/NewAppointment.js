import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Title, TextInput, RadioButton, Button } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";

export default function NewAppointment() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const types = [
    { label: "Ostéopathie", value: "Ostéopathie" },
    { label: "Cours Tapis", value: "Cours Tapis" },
  ];

  function submitForm() {
    // add checks

    console.log("submitted");
  }

  return (
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
        <View style={styles.button}>
          <Button color="#1098AD" mode="contained" onPress={() => submitForm()}>
            valider
          </Button>
        </View>
      </View>
    </View>
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
  button: { marginTop: 20, marginBottom: 10 },
  dropdown: {
    marginVertical: 10,
  },
});
