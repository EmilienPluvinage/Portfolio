import "../styles/styles.css";
import { Link, useLocation } from "react-router-dom";
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
} from "tabler-icons-react";
import { ThemeIcon } from "@mantine/core";

function LeftMenu() {
  const path = useLocation().pathname;
  const loggedIn = useLogin().login;
  const logging = useLogging();
  const patients = usePatients();
  const iconsStyle = {
    marginRight: "10px",
    position: "relative",
    top: "4px",
  };
  const iconsSize = 18;

  return (
    loggedIn && (
      <div id="LeftMenu">
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
              Liste des patients{" "}
              <ThemeIcon
                variant={path === "/Listing-Patients" ? "outline" : "default"}
                size={"sm"}
              >
                {patients.length}
              </ThemeIcon>
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
