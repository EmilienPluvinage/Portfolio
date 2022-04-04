import "../styles/topmenu.css";
import { useTheme } from "./ThemeContext";

function TopMenu({ menu, updateMenu, ItemData }) {
  const darkmode = useTheme();

  const categories = ItemData.reduce(
    (acc, item) =>
      acc.includes(item.category) ? acc : acc.concat(item.category),
    []
  );
  return (
    <nav className="top-menu">
      {categories.map((cat) =>
        cat === menu ? (
          <div className="clicked btn" key={cat}>
            {cat}
          </div>
        ) : (
          <div
            className={"btn " + darkmode}
            onClick={() => updateMenu(cat)}
            key={cat}
          >
            {cat}
          </div>
        )
      )}
    </nav>
  );
}

export default TopMenu;
