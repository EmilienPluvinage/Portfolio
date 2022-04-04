import "./styles/styles.css";
import Header from "./components/Header";
import Main from "./components/Main";
import LeftMenu from "./components/LeftMenu";
import Login from "./components/Login";
import { BrowserRouter as Router } from "react-router-dom";
import { useState } from "react";

function App() {
  const menu = [
    { link: "/", name: "Accueil" },
    { link: "/Nouveau-Patient", name: "Nouveau Patient" },
    { link: "/Listing-Patients", name: "Listing Patients" },
    { link: "/Agenda", name: "Agenda" },
    { link: "/Comptabilite", name: "Comptabilité" },
    { link: "/Statistiques", name: "Statistiques" },
  ];
  const [logged, setLogged] = useState(false);

  return (
    <div id="App">
      <Header />
      <div id="parent">
        {logged ? (
          <Router>
            <LeftMenu menu={menu} />
            <Main menu={menu} />
          </Router>
        ) : (
          <Login logged={logged} setLogged={setLogged} />
        )}
      </div>
    </div>
  );
}

export default App;
