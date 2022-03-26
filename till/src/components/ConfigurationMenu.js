import "../styles/topmenu.css";

function ConfigurationMenu({ configMenu, updateConfigMenu, darkmode }) {
  const categories = ["Staff", "Items", "Categories", "Contact"];
  return (
    <nav className="top-menu">
      {categories.map((cat) =>
        cat === configMenu ? (
          <span className="clicked" key={cat}>
            {cat}
          </span>
        ) : (
          <span
            className={darkmode}
            onClick={() => updateConfigMenu(cat)}
            key={cat}
          >
            {cat}
          </span>
        )
      )}
    </nav>
  );
}

export default ConfigurationMenu;
