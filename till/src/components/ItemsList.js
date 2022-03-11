import "../styles/item.css";
import { ItemData } from "../datas/ItemData";
import { displayPrice } from "./Functions";

function ItemsList(props) {
  function updateState(price, name) {
    props.updateCart(Math.round((props.cart + price) * 1e12) / 1e12);
    // we check if the article is already on the ticket, in which case we update the quantity, otherwise we add it
    var found = props.ticket.findIndex((e) => e.name === name);
    if (found !== -1) {
      // we found the article
      props.ticket[found].quantity++;
    } else {
      props.ticket.push({
        name: name,
        price: price,
        quantity: 1,
      });
    }
  }
  return (
    <div id="items">
      {ItemData.map(
        ({ name, category, price, id }) =>
          props.category === category && (
            <div
              key={id}
              className="item"
              onClick={() => updateState(price, name)}
            >
              {name}
              <div className="price">{displayPrice(price)} €</div>
            </div>
          )
      )}
    </div>
  );
}

export default ItemsList;
