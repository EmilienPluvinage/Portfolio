import "../../styles/topmenu.css";
import "../../styles/leftmenu.css";
import { Link } from "react-router-dom";

function ConfigurationMenu({ configMenu, darkmode }) {
  const categories = ["Staff", "Items", "Categories", "Contact"];
  return (
    <nav className="top-menu">
      {categories.map((cat) =>
        cat === configMenu ? (
          <Link to={"/Configuration/" + cat} className="text-link" key={cat}>
            <div className="clicked btn" key={cat}>
              {cat}
            </div>
          </Link>
        ) : (
          <Link to={"/Configuration/" + cat} className="text-link" key={cat}>
            <div className={"btn " + darkmode} key={cat}>
              {cat}
            </div>
          </Link>
        )
      )}
    </nav>
  );
}

export default ConfigurationMenu;
