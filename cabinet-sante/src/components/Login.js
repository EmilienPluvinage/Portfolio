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
    if (
      value.email.toLowerCase() === "email" &&
      value.password.toLowerCase() === "password"
    ) {
      close();
    } else {
      setErrorMessage("Identifiant ou mot de passe incorrect.");
    }
    event.preventDefault();
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
