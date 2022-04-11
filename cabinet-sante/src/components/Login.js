import "../styles/styles.css";
import { useState } from "react";
import { useLogin, useLogging } from "./contexts/AuthContext";
import { useEffect } from "react";
import { TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

function Login() {
  const currentToken = localStorage.getItem("token");
  const loggedIn = useLogin().login;
  const logging = useLogging();
  const [errorMessage, setErrorMessage] = useState("");

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
    if (currentToken !== null && loggedIn === false) {
      logging(true, currentToken);
    }
  }, [currentToken, loggedIn, logging]);

  async function handleSubmit(values) {
    try {
      const data = await postLogin(
        values.email.toLowerCase(),
        values.password.toLowerCase()
      );
      if (data.loggedIn) {
        logging(true, data.token);
        localStorage.setItem("token", data.token);
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
    !loggedIn && (
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
            />

            <TextInput
              label="Mot de passe :"
              type="password"
              name="password"
              placeholder="Votre mot de passe"
              {...form.getInputProps("password")}
              size={"sm"}
              style={{ margin: "10px" }}
            />

            <p>{errorMessage}</p>

            <Button type="submit" style={{ margin: "10px" }}>
              Connexion
            </Button>
          </form>
        </div>
      </div>
    )
  );
}

export default Login;
