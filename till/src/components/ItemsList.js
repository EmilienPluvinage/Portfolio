import "../styles/item.css";
import { ItemData } from "../datas/ItemData";
import { displayPrice } from "./Functions";

function ItemsList(props) {
  function updateState(price, name) {
    var NewTicket = props.ticket;
    // props.updateCart(Math.round((props.cart + price) * 1e12) / 1e12);
    // we check if the article is already on the ticket, in which case we update the quantity, otherwise we add it
    var found = NewTicket.findIndex((e) => e.name === name);
    if (found !== -1) {
      // we found the article
      NewTicket[found].quantity++;
    } else {
      NewTicket.push({
        name: name,
        price: price,
        quantity: 1,
      });
    }
    props.updateTicket(NewTicket);
    props.totalOfReceipt(NewTicket);
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
              <div className="item-content">
                {name}
                <div className="price">{displayPrice(price)} €</div>
              </div>
            </div>
          )
      )}
    </div>
  );
}

export default ItemsList;
