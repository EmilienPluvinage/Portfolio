import "../styles/styles.css";
import { useState } from "react";

function Login({ logged, setLogged }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [value, setValue] = useState({
    email: "",
    password: "",
  });
  function close() {
    setLogged(true);
  }
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
  function handleSubmit(event) {
    postLogin(
      value.email.toLowerCase(),
      value.password.toLowerCase(),
      callback
    );
    event.preventDefault();
  }

  function callback(data) {
    if (data.loggedIn) {
      // close();
      console.log("OK");
    } else {
      setErrorMessage("Mot de passe incorrect.");
    }
  }

  function postLogin(email, password, callback) {
    fetch("http://localhost:3001/Login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData) => {
        callback(actualData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  return (
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
  );
}

export default Login;
