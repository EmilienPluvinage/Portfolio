import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Title,
  TextInput,
  RadioButton,
  Text,
  Button,
} from "react-native-paper";
import { REACT_APP_API_DOMAIN } from "@env";
import { useLogin } from "./contexts/AuthContext";
import { useUpdatePatients } from "./contexts/PatientsContext";

export default function NewPatient() {
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [sex, setSex] = useState();
  const [loading, setLoading] = useState(false);
  const token = useLogin().token;
  const updateContext = useUpdatePatients().update;

  async function submitForm() {
    // add checks

    setLoading(true);
    const result = await addNewPatient(firstname, name, birthday, sex);
    if (result) {
      // on confirme dans la snackbar

      // on met à jour le state
      setName("");
      setFirstname("");
      setBirthday("");
      setSex();

      // on met à jour le contexte
      await updateContext(token);
    } else {
      // on met un message d'erreur dans la snackbar
    }
    setLoading(false);
  }

  async function addNewPatient(firstname, lastname, birthday, sex) {
    try {
      const fetchResponse = await fetch(
        REACT_APP_API_DOMAIN + "/NewPatientSimplified",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            birthday: new Date(birthday),
            sex: sex,
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      return res.success;
    } catch (e) {
      return e;
    }
  }

  function handleBirthday(text) {
    if (
      (text.length === 2 && birthday.length === 1) ||
      (text.length === 5 && birthday.length === 4)
    ) {
      setBirthday(text + "/");
    } else {
      setBirthday(text);
    }
  }

  return (
    <View style={styles.item}>
      <Title style={styles.text}>Nouveau Patient</Title>
      <View>
        <TextInput
          style={styles.textInput}
          activeUnderlineColor="#1098AD"
          label="Nom"
          value={name}
          onChangeText={(text) => setName(text)}
          type="outlined"
        />
        <TextInput
          style={styles.textInput}
          activeUnderlineColor="#1098AD"
          label="Prénom"
          value={firstname}
          onChangeText={(text) => setFirstname(text)}
          type="outlined"
        />
        <TextInput
          style={styles.textInput}
          activeUnderlineColor="#1098AD"
          label="Date de naissance"
          placeholder="JJ/MM/AAAA"
          value={birthday}
          onChangeText={(text) => handleBirthday(text)}
          type="outlined"
        />
        <RadioButton.Group
          onValueChange={(newValue) => setSex(newValue)}
          value={sex}
        >
          <View style={styles.radioButtonGroup}>
            <View style={styles.radioButton}>
              <Text style={styles.text}>Homme</Text>
              <RadioButton
                value="homme"
                uncheckedColor="#ffffff"
                color="#1098AD"
              />
            </View>
            <View style={styles.radioButton}>
              <Text style={styles.text}>Femme</Text>
              <RadioButton
                value="femme"
                uncheckedColor="#ffffff"
                color="#1098AD"
              />
            </View>
            <View style={styles.radioButton}>
              <Text style={styles.text}>Autre</Text>
              <RadioButton
                value="autre"
                uncheckedColor="#ffffff"
                color="#1098AD"
              />
            </View>
          </View>
        </RadioButton.Group>
        <Button
          loading={loading}
          color="#1098AD"
          mode="contained"
          onPress={() => submitForm()}
        >
          AJOUTER
        </Button>
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
  button: { marginVertical: 10 },
});
