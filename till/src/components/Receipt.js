import "../styles/receipt.css";
import { displayPrice } from "./Functions";
import DropdownMenu from "./DropdownMenu";
import { EmployeeData } from "../datas/EmployeeData";

function Receipt({
  cart,
  updateCart,
  ticket,
  updateTicket,
  ticketsOnHold,
  updateTicketsOnHold,
  putOnHold,
  totalOfReceipt,
  user,
}) {
  const color = EmployeeData.find((e) => e.name === user).color;

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
    // Removes focus so that we can re-open the menu
    document.activeElement.blur();
  }

  return (
    <div id="receipt">
      <div id="receipt-main">
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
              <DropdownMenu
                options={options}
                callback={dropdownCallback}
                name={name}
                quantity={quantity}
                text={
                  displayPrice(price * quantity) +
                  " € " +
                  name +
                  " x " +
                  quantity
                }
              />
            </div>
          ))}
        </div>
        <h3>TOTAL {displayPrice(Math.round(cart))} €</h3>
      </div>
      <div id="totals-parent">
        <div id="totals1"></div>
        <div id="totals2">
          <div
            className="total-btn"
            style={{ backgroundColor: color }}
            onClick={() => initState()}
          >
            EAT IN
          </div>
          <div
            className="total-btn"
            style={{ backgroundColor: color }}
            onClick={() => initState()}
          >
            TAKE AWAY
          </div>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
