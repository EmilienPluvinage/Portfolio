import "../styles/styles.css";
import { Link, useLocation } from "react-router-dom";

function LeftMenu({ menu }) {
  const path = useLocation().pathname;
  return (
    <div id="LeftMenu">
      <ul>
        {menu.map(({ link, name }) => (
          <Link key={link} to={link} className="text-link">
            <li className={path === link ? "clicked" : ""} key={link}>
              {name}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default LeftMenu;
