import { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Title,
  TextInput,
  RadioButton,
  Text,
  Button,
} from "react-native-paper";

export default function Login({ login, setLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function submitForm() {
    setLogin(true);
  }

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View style={styles.center}>
          <Title style={styles.text}>Mon Cabinet Santé</Title>
        </View>
        <TextInput
          style={styles.textInput}
          activeUnderlineColor="#1098AD"
          label="Adresse e-mail"
          value={username}
          onChangeText={(text) => setUsername(text)}
          type="outlined"
        />
        <TextInput
          secureTextEntry={true}
          style={styles.textInput}
          activeUnderlineColor="#1098AD"
          label="Mot de passe"
          value={password}
          onChangeText={(text) => setPassword(text)}
          type="outlined"
        />
        <Button
          color="#1098AD"
          mode="contained"
          onPress={() => submitForm()}
          style={styles.textInput}
        >
          Connexion
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
    color: "#1098AD",
    fontSize: 16,
    padding: 5,
  },
  textInput: {
    marginVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "rgb(30,30,30)",
    alignItems: "stretch",
    justifyContent: "flex-start",
    padding: 5,
  },
  center: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
