import "../styles/receipt.css";
import { displayPrice } from "./Functions";
// import Button from "react-bootstrap/Button";
// import Dropdown from "react-bootstrap/Dropdown";
// import DropdownButton from "react-bootstrap/DropdownButton";

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
    } else {
      NewTicket = ticket.map((line) => {
        var temp = Object.assign({}, line);
        if (temp.name === item) {
          temp.quantity -= quantityToRemove;
        }
        return temp;
      });
    }
    updateTicket(NewTicket);
    totalOfReceipt(NewTicket);
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

  return (
    <div id="receipt">
      {/* <DropdownButton id="dropdown-basic-button" title="Dropdown button">
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </DropdownButton> */}
      <span className="receipt-top-button" onClick={() => initState()}>
        Cancel
      </span>
      <span className="receipt-top-button" onClick={() => putOnHold()}>
        Put on Hold
      </span>
      <h3>RECEIPT</h3>
      <ul>
        {ticket.map(({ name, price, quantity }) => (
          <li key={name}>
            {displayPrice(price * quantity)} € {name} x {quantity}{" "}
            <span className="action" onClick={() => removeItem(name, 1)}>
              (-)
            </span>{" "}
            <span className="action" onClick={() => removeItem(name, quantity)}>
              (X)
            </span>{" "}
            <span className="action" onClick={() => reduceItem(name, 0.5)}>
              (-50)
            </span>
            <span className="action" onClick={() => changeQuantity(name, 3)}>
              (3)
            </span>
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
