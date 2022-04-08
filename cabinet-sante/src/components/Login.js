import "../styles/styles.css";
import { useState } from "react";
import { useLogin, useLogging } from "./contexts/AuthContext";
import { useEffect } from "react";

function Login() {
  const currentToken = localStorage.getItem("token");
  const loggedIn = useLogin().login;
  const logging = useLogging();
  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!loggedIn) {
      setValue({ email: "", password: "" });
      setErrorMessage("");
    }
  }, [loggedIn]);

  useEffect(() => {
    // if we're not logged in but there is an existing token in local storage
    // it means the user is returning, so we log him in.
    if (currentToken !== null && loggedIn === false) {
      logging(true, currentToken);
    }
  }, [currentToken, loggedIn, logging]);

  function handleChange(event, name) {
    switch (name) {
      case "email":
        setValue({ email: event.target.value, password: value.password });
        break;
      case "password":
        setValue({ email: value.email, password: event.target.value });
        break;
      default:
        break;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const data = await postLogin(
        value.email.toLowerCase(),
        value.password.toLowerCase()
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
          <form onSubmit={handleSubmit}>
            <p>E-mail :</p>
            <p>
              <input
                type="text"
                name="email"
                onChange={(e) => handleChange(e, "email")}
                value={value.email}
              />
            </p>
            <p>Mot de Passe :</p>
            <p>
              <input
                type="password"
                name="password"
                onChange={(e) => handleChange(e, "password")}
                value={value.password}
              />
            </p>
            <p>{errorMessage}</p>
            <input type="submit" className="btn" value="Login" />
          </form>
        </div>
      </div>
    )
  );
}

export default Login;
