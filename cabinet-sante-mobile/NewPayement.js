import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Title,
  TextInput,
  RadioButton,
  Text,
  Button,
  Snackbar,
} from "react-native-paper";
import { REACT_APP_API_DOMAIN } from "@env";
import { useLogin } from "./contexts/AuthContext";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import { capitalize } from "./Functions/Functions";

export default function NewPatient() {
  const patients = usePatients().patients;
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [sex, setSex] = useState();
  const [loading, setLoading] = useState(false);
  const token = useLogin().token;
  const updateContext = useUpdatePatients().update;
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  function checkValues(values) {
    if (values.sex === null || values.sex === undefined || values.sex === "") {
      return {
        check: false,
        message: "Vous devez indiquer le genre de la personne.",
      };
    }

    if (values.lastname === "")
      return {
        check: false,
        message: "Vous devez entrer au moins un nom de famille.",
      };

    // we check if there isn't already a patient with same first and last name, and whose birthday is less an a year to this one
    var index = patients.findIndex(
      (element) =>
        capitalize(element?.lastname) === capitalize(values?.lastname) &&
        capitalize(element?.firstname) === capitalize(values?.firstname)
    );
    if (index !== -1) {
      // now we need to look at the birthday. Either the new patient AND the old one don't have birthday sets, in which case there's gonna be an issue
      if (values.birthday === "" || values.birthday === null) {
        return {
          check: false,
          message:
            "Il existe déjà un patient avec le même nom et prénom. Merci d'indiquer un deuxième prénom ou bien une date de naissance afin de les distinguer.",
        };
      }
      if (
        values.birthday !== "" &&
        values.birthday !== null &&
        patients[index]?.birthday !== ""
      ) {
        // then we need to make sure that there is at least one year between their two birthdate to make sure at no point they will have the same age.
        var difference =
          new Date(values.birthday).getTime() -
          new Date(patients[index]?.birthday).getTime();
        var days = Math.abs(Math.ceil(difference / (1000 * 3600 * 24)));
        if (days < 365) {
          return {
            check: false,
            message:
              "Il existe déjà un patient avec le même nom, prénom, et moins d'un an de différence d'âge. Merci d'indiquer un deuxième prénom afin de les distinguer.",
          };
        }
      }
      // Finally if one has a birthdate selected and not the other one doesn't it's fine because we can distinguish them based on that,
      // so we carry on our checks
    }

    return { check: true };
  }

  async function submitForm() {
    // add checks
    const check = checkValues({
      firstname: firstname,
      lastname: name,
      birthday: birthday,
      sex: sex,
    });
    if (check.check) {
      setLoading(true);
      const result = await addNewPatient(firstname, name, birthday, sex);
      if (result) {
        // on confirme dans la snackbar

        // on met à jour le contexte
        await updateContext(token);
        // on met à jour le state
        setName("");
        setFirstname("");
        setBirthday("");
        setSex();
        setSnackbarMsg("Patient ajouté.");
        setShowSnackbar(true);
      } else {
        // on met un message d'erreur dans la snackbar
      }
    } else {
      setSnackbarMsg(check.message);
      setShowSnackbar(true);
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
    <>
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
