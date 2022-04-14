import "../styles/styles.css";
import { useState } from "react";
import { useLogin, useLogging } from "./contexts/AuthContext";
import { useEffect } from "react";
import { TextInput, Button, Loader, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { Check } from "tabler-icons-react";

function Login() {
  const currentToken = localStorage.getItem("token");
  const loggedIn = useLogin().login;
  const logging = useLogging();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Format de l'email incorrect.",
    },
  });

  useEffect(() => {
    // if we're not logged in but there is an existing token in local storage
    // it means the user is returning, so we log him in.
    async function returning() {
      if (currentToken !== null && loggedIn === false) {
        setLoading(true);
        await logging(true, currentToken);
        setLoading(false);
      }
    }
    returning();
  }, [currentToken, loggedIn, logging]);

  async function handleSubmit(values) {
    try {
      const data = await postLogin(
        values.email.toLowerCase(),
        values.password.toLowerCase()
      );
      if (data.loggedIn) {
        showNotification({
          title: "Connexion réussie",
          message: "Bienvenue sur votre espace client.",
          color: "green",
          icon: <Check />,
        });
        setLoading(true);
        await logging(true, data.token);
        localStorage.setItem("token", data.token);
        setErrorMessage("");
        form.reset();
        setLoading(false);
      } else {
        switch (data.error) {
          case "incorrect password":
            setErrorMessage("Mot de passe incorrect.");
            break;
          case "incorrect e-mail":
            setErrorMessage("Utilisateur non-reconnu.");
            break;
          default:
            setErrorMessage("Erreur de connexion.");
            break;
        }
      }
    } catch (e) {
      return e;
    }
  }

  async function postLogin(email, password) {
    try {
      const fetchResponse = await fetch("http://localhost:3001/Login", {
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

  return (
    !loggedIn &&
    (!loading ? (
      <div id="LoginScreen">
        <div id="LoginContent">
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <TextInput
              label="E-mail"
              name="email"
              placeholder="Votre e-mail"
              {...form.getInputProps("email")}
              size={"sm"}
              style={{ margin: "10px" }}
              required
            />

            <TextInput
              label="Mot de passe :"
              type="password"
              name="password"
              placeholder="Votre mot de passe"
              {...form.getInputProps("password")}
              size={"sm"}
              style={{ margin: "10px" }}
              required
            />

            <p>{errorMessage}</p>

            <Button type="submit" style={{ margin: "10px" }}>
              Connexion
            </Button>
          </form>
        </div>
      </div>
    ) : (
      <div id="LoginScreen">
        <div id="LoginContent">
          <Text style={{ marginBottom: "30px" }} size={"sm"}>
            Récupération des données en cours...
          </Text>
          <Loader size="xl" />
        </div>
      </div>
    ))
  );
}

export default Login;
