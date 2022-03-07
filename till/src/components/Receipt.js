import "../styles/receipt.css";

function Receipt({ cart, updateCart, ticket, updateTicket }) {
  function initState() {
    updateCart(0);
    updateTicket([]);
  }
  return (
    <div id="receipt">
      <h3>RECEIPT</h3>
      <ul>
        {ticket.map(({ name, price, quantity }) => (
          <li key={name}>
            {(Math.round(price * quantity * 100) / 100)
              .toString()
              .replace(".", ",")}{" "}
            € {name} x {quantity}
          </li>
        ))}
      </ul>
      <h3>
        TOTAL {(Math.round(cart * 100) / 100).toString().replace(".", ",")} €
      </h3>
      <div id="totals">
        <button onClick={() => initState()}>EAT IN</button>
        <button onClick={() => initState()}>TAKE AWAY</button>
      </div>
    </div>
  );
}

export default Receipt;
