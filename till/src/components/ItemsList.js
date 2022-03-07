import "../styles/item.css";
import { ItemData } from "../datas/ItemData";

function ItemsList(props) {
  return (
    <div id="items">
      {ItemData.map(
        ({ name, category, price, id }) =>
          props.category === category && (
            <div
              key={id}
              className="item"
              onClick={() => props.updateCart(props.cart + price)}
            >
              {name}
              <div className="price">
                {price.toString().replace(".", ",")} €
              </div>
            </div>
          )
      )}
    </div>
  );
}

export default ItemsList;
