import "./styles/styles.css";
import Header from "./components/Header";
import Main from "./components/Main";
import LeftMenu from "./components/LeftMenu";
import Login from "./components/Login";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./components/contexts/AuthContext";
import { PatientsProvider } from "./components/contexts/PatientsContext";
import { GovDataProvider } from "./components/contexts/GovDataContext";
import { ConfigurationProvider } from "./components/contexts/ConfigContext";
import { NotificationsProvider } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";

function App() {
  const menu = [
    { link: "/", name: "Accueil" },
    { link: "/Nouveau-Patient", name: "Nouveau Patient" },
    { link: "/Listing-Patients", name: "Listing Patients" },
    { link: "/Agenda", name: "Agenda" },
    { link: "/Comptabilite", name: "Comptabilité" },
    { link: "/Statistiques", name: "Statistiques" },
    { link: "/Parametres", name: "Paramètres" },
  ];

  return (
    <div id="App">
      <GovDataProvider>
        <MantineProvider
          theme={{
            primaryColor: "cyan",
          }}
        >
          <NotificationsProvider position="top-right">
            <ConfigurationProvider>
              <PatientsProvider>
                <AuthProvider>
                  <Header />
                  <div id="parent">
                    <Router>
                      <LeftMenu />
                      <Main menu={menu} />
                    </Router>
                    <Login />
                  </div>
                </AuthProvider>
              </PatientsProvider>
            </ConfigurationProvider>
          </NotificationsProvider>
        </MantineProvider>
      </GovDataProvider>
    </div>
  );
}

export default App;
