import "../styles/topmenu.css";
import { ItemData } from "../datas/ItemData";

function TopMenu() {
  const categories = ItemData.reduce(
    (acc, item) =>
      acc.includes(item.category) ? acc : acc.concat(item.category),
    []
  );
  return (
    <nav id="top-menu">
      {categories.map((cat) => (
        <a key={cat}>{cat}</a>
      ))}
    </nav>
  );
}

export default TopMenu;
