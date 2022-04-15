import "../styles/styles.css";
import { Link, useLocation } from "react-router-dom";
import { useLogin, useLogging } from "./contexts/AuthContext";
import {
  List,
  UserPlus,
  Home,
  Logout,
  ChartBar,
  Calculator,
  CalendarStats,
  Settings,
} from "tabler-icons-react";

function LeftMenu() {
  const path = useLocation().pathname;
  const loggedIn = useLogin().login;
  const logging = useLogging();
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
