import "../styles/topmenu.css";

function ConfigurationMenu({ configMenu, updateConfigMenu, darkmode }) {
  const categories = ["Staff", "Items", "Categories", "Contact"];
  return (
    <nav className="top-menu">
      {categories.map((cat) =>
        cat === configMenu ? (
          <div className="clicked btn" key={cat}>
            {cat}
          </div>
        ) : (
          <div
            className={"btn " + darkmode}
            onClick={() => updateConfigMenu(cat)}
            key={cat}
          >
            {cat}
          </div>
        )
      )}
    </nav>
  );
}

export default ConfigurationMenu;
