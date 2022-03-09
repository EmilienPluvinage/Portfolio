import "../styles/receipt.css";
import { displayPrice } from "./Functions";

function Receipt({ cart, updateCart, ticket, updateTicket }) {
  function initState() {
    updateCart(0);
    updateTicket([]);
  }
  return (
    <div id="receipt">
      <span className="receipt-top-button">Actions</span>
      <span className="receipt-top-button" onClick={() => initState()}>
        Cancel
      </span>
      <span className="receipt-top-button">Put on Hold</span>
      <h3>RECEIPT</h3>
      <ul>
        {ticket.map(({ name, price, quantity }) => (
          <li key={name}>
            {displayPrice(price * quantity)} € {name} x {quantity}
          </li>
        ))}
      </ul>
      <h3>TOTAL {displayPrice(cart)} €</h3>
      <div id="totals">
        <button onClick={() => initState()}>EAT IN</button>
        <button onClick={() => initState()}>TAKE AWAY</button>
      </div>
    </div>
  );
}

export default Receipt;
