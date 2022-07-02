import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
  Title,
  TextInput,
  RadioButton,
  Text,
  Button,
  Snackbar,
} from "react-native-paper";
import { useLogin, useLogging } from "./contexts/AuthContext";
import { REACT_APP_API_DOMAIN } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const currentToken = AsyncStorage.getItem("token");
  const loggedIn = useLogin().login;
  const logging = useLogging();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // if we're not logged in but there is an existing token in local storage
    // it means the user is returning, so we log him in.
    async function returning() {
      if (
        currentToken !== null &&
        loggedIn === false &&
        AsyncStorage.getItem("rememberMe") === "true" &&
        l
      ) {
        await logging(true, currentToken);
      }
    }
    returning();
  }, [currentToken, loggedIn, logging]);

  async function postLogin(email, password) {
    try {
      const fetchResponse = await fetch(REACT_APP_API_DOMAIN + "/Login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await fetchResponse.json();
      return data;
    } catch (e) {
      return e;
    }
  }

  async function submitForm() {
    try {
      const data = await postLogin(username.toLowerCase(), password);
      if (data.loggedIn) {
        setError("");
        await logging(true, data.token);
        AsyncStorage.setItem("token", data.token);
        AsyncStorage.setItem("rememberMe", JSON.stringify(true));
      } else {
        switch (data.error) {
          case "incorrect password":
            setError("Mot de passe incorrect.");
            break;
          case "incorrect e-mail":
            setError("Utilisateur non-reconnu.");
            break;
          default:
            setError("Erreur de connexion.");
            break;
        }

        setOpen(true);
      }
    } catch (e) {
      return e;
    }
  }

  return (
    <>
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
      <Snackbar
        visible={open}
        onDismiss={() => setOpen(false)}
        action={{
          label: "OK",
          onPress: () => setOpen(false),
        }}
      >
        {error}
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
