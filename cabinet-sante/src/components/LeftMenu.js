import "../styles/styles.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogin, useLogging } from "./contexts/AuthContext";
import { usePatients } from "./contexts/PatientsContext";
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
} from "tabler-icons-react";
import { Autocomplete, Center, Select } from "@mantine/core";
import { useState } from "react";

function LeftMenu() {
  const navigate = useNavigate();
  const patients = usePatients();
  const patientsList = patients.map((e) => {
    return e.fullname;
  });
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
      navigate("/Nouveau-patient/" + patients[index].id);
      setSearch("");
    }
  }
  return (
    loggedIn && (
      <div id="LeftMenu">
        <Center>
          <Select
            searchable
            maxDropdownHeight={500}
            placeholder="Rechercher un patient"
            data={patientsList}
            icon={<Search size={18} />}
            style={{
              marginTop: "20px",
              marginLeft: "20px",
              marginBottom: "10px",
            }}
            value={search}
            onChange={handleSearch}
          />
        </Center>
        <ul>
          <Link to="/" className="text-link">
            <li className={path === "/" ? "clicked" : ""}>
              <Home size={iconsSize} style={iconsStyle} />
              Accueil
            </li>
          </Link>
          <Link to="/Nouveau-Patient" className="text-link">
            <li className={path === "/Nouveau-Patient" ? "clicked" : ""}>
              <UserPlus size={iconsSize} style={iconsStyle} />
              Nouveau Patient
            </li>
          </Link>
          <Link to="/Listing-Patients" className="text-link">
            <li className={path === "/Listing-Patients" ? "clicked" : ""}>
              <List size={iconsSize} style={iconsStyle} />
              Liste des patients
            </li>
          </Link>
          <Link to="/Agenda" className="text-link">
            <li className={path === "/Agenda" ? "clicked" : ""}>
              <CalendarStats size={iconsSize} style={iconsStyle} />
              Agenda
            </li>
          </Link>
          <Link to="/Comptabilite" className="text-link">
            <li className={path === "/Comptabilite" ? "clicked" : ""}>
              <Calculator size={iconsSize} style={iconsStyle} />
              Comptabilité
            </li>
          </Link>
          <Link to="/Statistiques" className="text-link">
            <li className={path === "/Statistiques" ? "clicked" : ""}>
              <ChartBar size={iconsSize} style={iconsStyle} />
              Statistiques
            </li>
          </Link>
          <Link to="/Parametres" className="text-link">
            <li className={path === "/Parametres" ? "clicked" : ""}>
              <Settings size={iconsSize} style={iconsStyle} />
              Paramètres
            </li>
          </Link>

          <li onClick={() => logging(false)}>
            <Logout size={iconsSize} style={iconsStyle} />
            Déconnexion
          </li>
        </ul>
      </div>
    )
  );
}

export default LeftMenu;
