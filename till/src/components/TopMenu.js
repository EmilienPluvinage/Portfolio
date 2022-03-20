import "../styles/topmenu.css";

function TopMenu({ menu, updateMenu, darkmode, ItemData }) {
  const categories = ItemData.reduce(
    (acc, item) =>
      acc.includes(item.category) ? acc : acc.concat(item.category),
    []
  );
  return (
    <nav id="top-menu">
      {categories.map((cat) =>
        cat === menu ? (
          <span className="clicked" key={cat}>
            {cat}
          </span>
        ) : (
          <span className={darkmode} onClick={() => updateMenu(cat)} key={cat}>
            {cat}
          </span>
        )
      )}
    </nav>
  );
}

export default TopMenu;
