import "../styles/styles.css";
import { Link, useLocation } from "react-router-dom";
import { useLogin, useLoginUpdate } from "./AuthContext";

function LeftMenu({ menu }) {
  const path = useLocation().pathname;
  const loggedIn = useLogin();
  const loggingOut = useLoginUpdate();

  return (
    loggedIn && (
      <div id="LeftMenu">
        <ul>
          {menu.map(({ link, name }) => (
            <Link key={link} to={link} className="text-link">
              <li className={path === link ? "clicked" : ""} key={link}>
                {name}
              </li>
            </Link>
          ))}
          <li onClick={loggingOut}>Déconnexion</li>
        </ul>
      </div>
    )
  );
}

export default LeftMenu;
