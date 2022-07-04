import "../styles/styles.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogin, useLogging } from "./contexts/AuthContext";
import { usePatients, useUpdatePatients } from "./contexts/PatientsContext";
import {
  List,
  UserPlus,
  Home,
  Logout,
  ChartBar,
  Calculator,
  CalendarStats,
  Settings,
  Search,
  ReportMedical,
  Checkbox,
  Refresh,
} from "tabler-icons-react";
import { Center, Select, Modal, Badge } from "@mantine/core";
import { useState } from "react";
import NewAppointment from "./NewAppointment";

function LeftMenu() {
  const navigate = useNavigate();
  const patients = usePatients().patients;
  const patientsList = patients
    .filter((e) => e.death === "")
    .map((e) => {
      return e.fullname;
    });
  const updateContext = useUpdatePatients().update;
  const token = useLogin().token;
  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState("");
  const path = useLocation().pathname;
  const loggedIn = useLogin().login;
  const logging = useLogging();
  const iconsStyle = {
    marginRight: "10px",
    position: "relative",
    top: "4px",
  };
  const iconsSize = 18;

  function handleSearch(value) {
    setSearch(value);
    var index = patients.findIndex((e) => e.fullname === value);
    if (index !== -1) {
      navigate("/CabinetSante/Nouveau-patient/" + patients[index].id);
    }
    setSearch(null);
  }

  return (
    loggedIn && (
      <>
        <Modal
          centered
          overlayOpacity={0.3}
          opened={opened}
          onClose={() => setOpened(false)}
          title={"Consultation"}
          closeOnClickOutside={false}
        >
          {opened && (
            <NewAppointment
              setOpened={setOpened}
              startingTime={0}
              patientId={0}
              appointmentId={0}
            />
          )}
        </Modal>

        <div id="LeftMenu">
          <Center>
            <Select
              limit={5}
              searchable
              clearable
              placeholder="Rechercher un patient"
              data={patientsList}
              icon={<Search size={18} />}
              style={{
                marginTop: "20px",
                marginLeft: "20px",
                marginBottom: "10px",
                autoComplete: "off",
              }}
              value={search}
              onChange={handleSearch}
            />
          </Center>
          <ul>
            <Link to="/CabinetSante/" className="text-link">
              <li className={path === "/CabinetSante/" ? "clicked" : ""}>
                <Home size={iconsSize} style={iconsStyle} />
                Accueil
              </li>
            </Link>
            <Link to="/CabinetSante/Nouveau-Patient" className="text-link">
              <li
                className={
                  path === "/CabinetSante/Nouveau-Patient" ? "clicked" : ""
                }
              >
                <UserPlus size={iconsSize} style={iconsStyle} />
                Nouveau Patient
              </li>
            </Link>

            <li onClick={() => setOpened(true)}>
              <ReportMedical size={iconsSize} style={iconsStyle} />
              Nouvelle Consultation
            </li>
            <Link to="/CabinetSante/Listing-Patients" className="text-link">
              <li
                className={
                  path === "/CabinetSante/Listing-Patients" ? "clicked" : ""
                }
              >
                <List size={iconsSize} style={iconsStyle} />
                Liste des patients{" "}
                <Badge
                  variant="filled"
                  size="xs"
                  style={{ position: "relative", bottom: "2px" }}
                >
                  {patients.length}
                </Badge>
              </li>
            </Link>
            <Link to="/CabinetSante/Agenda" className="text-link">
              <li className={path === "/CabinetSante/Agenda" ? "clicked" : ""}>
                <CalendarStats size={iconsSize} style={iconsStyle} />
                Agenda
              </li>
            </Link>
            <Link to="/CabinetSante/Comptabilite" className="text-link">
              <li
                className={
                  path === "/CabinetSante/Comptabilite" ? "clicked" : ""
                }
              >
                <Calculator size={iconsSize} style={iconsStyle} />
                Comptabilité
              </li>
            </Link>
            <Link to="/CabinetSante/Resume" className="text-link">
              <li className={path === "/CabinetSante/Resume" ? "clicked" : ""}>
                <Checkbox size={iconsSize} style={iconsStyle} />
                Résumé
              </li>
            </Link>
            <Link to="/CabinetSante/Statistiques" className="text-link">
              <li
                className={
                  path === "/CabinetSante/Statistiques" ? "clicked" : ""
                }
              >
                <ChartBar size={iconsSize} style={iconsStyle} />
                Statistiques
              </li>
            </Link>
            <Link to="/CabinetSante/Parametres" className="text-link">
              <li
                className={path === "/CabinetSante/Parametres" ? "clicked" : ""}
              >
                <Settings size={iconsSize} style={iconsStyle} />
                Paramètres
              </li>
            </Link>
            <li onClick={() => updateContext(token)}>
              <Refresh size={iconsSize} style={iconsStyle} />
              Rafraîchir
            </li>
            <li onClick={() => logging(false)}>
              <Logout size={iconsSize} style={iconsStyle} />
              Déconnexion
            </li>
          </ul>
        </div>
      </>
    )
  );
}

export default LeftMenu;
