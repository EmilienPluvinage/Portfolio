import "../styles/styles.css";
import { useState } from "react";
import { useLogin, useLogging } from "./contexts/AuthContext";
import { useEffect } from "react";
import {
  TextInput,
  Button,
  Loader,
  Text,
  Checkbox,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { cleanNotifications, showNotification } from "@mantine/notifications";
import { Check, ExclamationMark } from "tabler-icons-react";
import { useLocation } from "react-router-dom";

function Login() {
  const path = useLocation().pathname;
  const currentToken = localStorage.getItem("token");
  const loggedIn = useLogin().login;
  const logging = useLogging();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(
    localStorage.getItem("rememberMe") === "true"
  );

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
    if (path === "/CabinetSante/Demo") {
      const timer = setTimeout(() => {
        showNotification({
          title: "Version de démonstration",
          message:
            "Si vous souhaitez accéder à la version de démonstration, veuillez rentrer comme adresse e-mail demo@demo.com et comme mot de passe Demo suivi de l'année d'adoption de l'accord de Paris sur le climat.",
          icon: <ExclamationMark />,
          autoClose: false,
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [path]);

  useEffect(() => {
    // if we're not logged in but there is an existing token in local storage
    // it means the user is returning, so we log him in.
    async function returning() {
      if (
        currentToken !== null &&
        loggedIn === false &&
        localStorage.getItem("rememberMe") === "true" &&
        loading === false
      ) {
        setLoading(true);
        await logging(true, currentToken);
        setLoading(false);
      }
    }
    returning();
  }, [currentToken, loggedIn, logging, loading]);

  // if not logged in and the path is Demo then we display a notification to advise the visitor of the username and password

  async function handleSubmit(values) {
    try {
      const data = await postLogin(values.email.toLowerCase(), values.password);
      if (data.loggedIn) {
        setLoading(true);
        cleanNotifications();
        showNotification({
          title: "Connexion réussie",
          message: "Bienvenue sur votre espace client.",
          color: "green",
          icon: <Check />,
        });

        await logging(true, data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("rememberMe", checked);
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
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/Login",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
        }
      );
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
              className="input"
              label="E-mail"
              name="email"
              placeholder="Votre e-mail"
              {...form.getInputProps("email")}
              size={"sm"}
              style={{ margin: "10px" }}
              required
            />

            <TextInput
              className="input"
              label="Mot de passe :"
              type="password"
              name="password"
              placeholder="Votre mot de passe"
              {...form.getInputProps("password")}
              size={"sm"}
              style={{ margin: "10px" }}
              required
            />
            <Center>
              <Checkbox
                label="Se souvenir de moi"
                checked={checked}
                onChange={(event) => setChecked(event.currentTarget.checked)}
                style={{ margin: "10px" }}
              />
            </Center>

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
