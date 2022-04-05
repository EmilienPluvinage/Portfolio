import "../styles/styles.css";
import { Link, useLocation } from "react-router-dom";
import { useLogin, useLogging } from "./contexts/AuthContext";

function LeftMenu({ menu }) {
  const path = useLocation().pathname;
  const loggedIn = useLogin().login;
  const logging = useLogging();

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
          <li onClick={() => logging(false)}>Déconnexion</li>
        </ul>
      </div>
    )
  );
}

export default LeftMenu;
