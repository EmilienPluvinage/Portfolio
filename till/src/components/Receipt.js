import "../styles/receipt.css";
import { displayPrice } from "./Functions";
import DropdownMenu2 from "./DropdownMenu2";

function Receipt({
  cart,
  updateCart,
  ticket,
  updateTicket,
  ticketsOnHold,
  updateTicketsOnHold,
  putOnHold,
  totalOfReceipt,
}) {
  function initState() {
    updateCart(0);
    updateTicket([]);
  }

  function removeItem(item, quantityToRemove) {
    // removes "quantity" of "name" items on current ticket
    var ItemToUpdate = ticket.find((e) => e.name === item);
    var NewTicket = [];
    if (ItemToUpdate.quantity <= quantityToRemove) {
      // we remove it completely
      NewTicket = ticket.filter((e) => e.name !== item);
      updateTicket(NewTicket);
      totalOfReceipt(NewTicket);
    } else {
      changeQuantity(item, ItemToUpdate.quantity - quantityToRemove);
    }
  }

  function reduceItem(item, ratio) {
    var NewTicket = ticket.map((line) => {
      var temp = Object.assign({}, line);
      if (temp.name === item) {
        temp.price *= 1 - ratio;
      }
      return temp;
    });

    updateTicket(NewTicket);
    totalOfReceipt(NewTicket);
  }

  function changeQuantity(item, newQuantity) {
    // we assume that the value of newQuantity has already been checked before calling the function
    var NewTicket = ticket.map((line) => {
      var temp = Object.assign({}, line);
      if (temp.name === item) {
        temp.quantity = newQuantity;
      }
      return temp;
    });
    updateTicket(NewTicket);
    totalOfReceipt(NewTicket);
  }
  const options = [
    "Supprimer Ligne",
    "Enlever 1",
    "Changer Quantité",
    "Réduction",
  ];

  function dropdownCallback(value, name, quantity) {
    switch (value) {
      case options[0]:
        removeItem(name, quantity);
        break;
      case options[1]:
        removeItem(name, 1);
        break;
      case options[2]:
        changeQuantity(name, 3);
        break;
      case options[3]:
        reduceItem(name, 0.5);
        break;
      default:
        alert(5);
    }
  }

  return (
    <div id="receipt">
      <span className="receipt-top-button" onClick={() => initState()}>
        Cancel
      </span>
      <span className="receipt-top-button" onClick={() => putOnHold()}>
        Put on Hold
      </span>
      <h3 id="receipt-h3">RECEIPT</h3>
      <div id="receipt-content">
        {ticket.map(({ name, price, quantity }) => (
          <div className="receipt-item" key={name}>
            <DropdownMenu2
              options={options}
              callback={dropdownCallback}
              name={name}
              quantity={quantity}
              text={
                displayPrice(price * quantity) + " € " + name + " x " + quantity
              }
            />
          </div>
        ))}
      </div>
      <h3>TOTAL {displayPrice(cart)} €</h3>
      <div id="totals">
        <button onClick={() => initState()}>EAT IN</button>
        <button onClick={() => initState()}>TAKE AWAY</button>
      </div>
    </div>
  );
}

export default Receipt;
