import "../styles/receipt.css";

function Receipt() {
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
        <h3>5,70 €</h3>
        <div id="totals">
          <a>EAT IN</a>
          <a>TAKE AWAY</a>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
