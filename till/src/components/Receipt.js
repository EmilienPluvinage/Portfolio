import "../styles/receipt.css";

function Receipt({ cart, updateCart }) {
  return (
    <div>
      <div id="receipt">
        <h3>RECEIPT</h3>
        <ul>
          <li>1,50 € Cookie</li>
          <li>1 € Croissant</li>
          <li>2,20 € Pain au chocolat x 2</li>
          <li>1 € Baguette</li>
        </ul>
        <h3>{(Math.round(cart * 100) / 100).toString().replace(".", ",")} €</h3>
        <div id="totals">
          <button onClick={() => updateCart(0)}>EAT IN</button>
          <button onClick={() => updateCart(0)}>TAKE AWAY</button>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
