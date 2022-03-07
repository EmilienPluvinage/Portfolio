import "../styles/topmenu.css";
import { ItemData } from "../datas/ItemData";

function TopMenu({ menu, updateMenu }) {
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
          <span onClick={() => updateMenu(cat)} key={cat}>
            {cat}
          </span>
        )
      )}
    </nav>
  );
}

export default TopMenu;
