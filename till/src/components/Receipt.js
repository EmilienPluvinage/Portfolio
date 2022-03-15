import "../styles/receipt.css";
import { displayPrice } from "./Functions";
import DropdownMenu from "./DropdownMenu";
import InputDialog from "./InputDialog";
import PayementScreen from "./PayementScreen";
import { EmployeeData } from "../datas/EmployeeData";
import { useState } from "react";

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
  const [inputDialog, updateInputDialog] = useState({
    open: false,
    name: "",
    text: "",
    callback: null,
  });
  const [payementOptions, updatePayementOptions] = useState({
    open: false,
    vat: "", // in or out
    callback: null,
  });

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
        temp.discount *= 1 - ratio / 100;
      }
      return temp;
    });

    updateTicket(NewTicket);
    totalOfReceipt(NewTicket);
  }

  function reduceTicket(item, ratio) {
    var NewTicket = ticket.map((line) => {
      var temp = Object.assign({}, line);
      temp.discount *= 1 - ratio / 100;
      return temp;
    });

    updateTicket(NewTicket);
    totalOfReceipt(NewTicket);
  }

  function changeQuantity(item, newQuantity) {
    if (newQuantity <= 0) {
      removeItem(item, ticket.find((e) => e.name === item).quantity);
    } else {
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
  }
  const options = [
    "Remove Row",
    "Remove One",
    "Change Quantity",
    "Discount",
    "Discount All",
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
        updateInputDialog({
          open: true,
          name: name,
          text: "Please enter the quantity you'd like :",
          callback: changeQuantity,
        });
        break;
      case options[3]:
        updateInputDialog({
          open: true,
          name: name,
          text: "Please enter a discount between 0% and 100% :",
          callback: reduceItem,
        });
        break;
      case options[4]:
        updateInputDialog({
          open: true,
          name: name,
          text: "Please enter a discount between 0% and 100% :",
          callback: reduceTicket,
        });
        break;
      default:
        alert("Error");
    }
    // Removes focus so that we can re-open the menu
    document.activeElement.blur();
  }

  function setExpanded(bool) {
    updateInputDialog({
      open: bool,
      name: inputDialog.name,
      text: inputDialog.text,
      callback: inputDialog.callback,
    });
  }

  function setExpandedPayement(bool) {
    updatePayementOptions({
      open: bool,
      vat: payementOptions.vat,
      callback: payementOptions.callback,
    });
  }

  function goToCheckout(inOrOut) {
    updatePayementOptions({
      open: true,
      vat: inOrOut,
      callback: payementOptions.callback,
    });
  }

  return (
    <div id="receipt">
      <InputDialog options={inputDialog} setExpanded={setExpanded} />
      <PayementScreen
        options={payementOptions}
        setExpanded={setExpandedPayement}
        ticket={ticket}
        cart={cart}
      />
      <div id="receipt-user-name" style={{ backgroundColor: color }}>
        <h3>{user}</h3>
      </div>
      <div id="receipt-main">
        <span className="receipt-top-button" onClick={() => initState()}>
          Cancel
        </span>
        <span className="receipt-top-button" onClick={() => putOnHold()}>
          Put on Hold
        </span>

        <h3 id="receipt-h3">RECEIPT</h3>
        <div id="receipt-content">
          {ticket.map(({ name, price, quantity, discount }) => (
            <div className="receipt-item" key={name}>
              <DropdownMenu
                options={options}
                callback={dropdownCallback}
                name={name}
                quantity={quantity}
                text={
                  displayPrice(price * quantity * discount) +
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
            onClick={() => cart !== 0 && goToCheckout("in")}
          >
            EAT IN
          </div>
          <div
            className="total-btn"
            style={{ backgroundColor: color }}
            onClick={() => cart !== 0 && goToCheckout("out")}
          >
            TAKE AWAY
          </div>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
