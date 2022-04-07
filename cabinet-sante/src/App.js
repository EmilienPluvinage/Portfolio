import "./styles/styles.css";
import Header from "./components/Header";
import Main from "./components/Main";
import LeftMenu from "./components/LeftMenu";
import Login from "./components/Login";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./components/contexts/AuthContext";
import { PatientsProvider } from "./components/contexts/PatientsContext";

function App() {
  const menu = [
    { link: "/", name: "Accueil" },
    { link: "/Nouveau-Patient", name: "Nouveau Patient" },
    { link: "/Listing-Patients", name: "Listing Patients" },
    { link: "/Agenda", name: "Agenda" },
    { link: "/Comptabilite", name: "Comptabilité" },
    { link: "/Statistiques", name: "Statistiques" },
  ];

  return (
    <div id="App">
      <AuthProvider>
        <PatientsProvider>
          <Header />
          <div id="parent">
            <Router>
              <LeftMenu menu={menu} />
              <Main menu={menu} />
            </Router>
            <Login />
          </div>
        </PatientsProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
