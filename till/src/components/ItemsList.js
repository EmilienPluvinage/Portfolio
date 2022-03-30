import "../styles/item.css";
import { displayPrice } from "./Functions";
import { useState } from "react";
import InputDialog from "./InputDialog";

function ItemsList(props) {
  const [inputDialog, updateInputDialog] = useState({
    open: false,
    name: "",
    text: "",
    callback: null,
  });

  function setExpanded(bool) {
    updateInputDialog({
      open: bool,
      name: inputDialog.name,
      text: inputDialog.text,
      callback: inputDialog.callback,
    });
  }

  function updateState(name, price, directSale) {
    var NewTicket = props.ticket;
    // we check if the article is already on the ticket, in which case we update the quantity, otherwise we add it
    var found = NewTicket.findIndex((e) => e.name === name);
    if (found !== -1) {
      // we found the article
      if (directSale) {
        NewTicket[found].price += parseInt(price);
      } else {
        NewTicket[found].quantity++;
      }
    } else {
      NewTicket.push({
        name: name,
        price: Math.round(price),
        quantity: 1,
        discount: 1,
      });
    }
    props.updateTicket(NewTicket);
    props.totalOfReceipt(NewTicket);
  }

  function directSale(name, price) {
    updateState(name, price, true);
  }

  function ClickOnDirectSale() {
    updateInputDialog({
      open: true,
      name: "Manual Input",
      type: "number",
      text: "Please enter a price in cents :",
      callback: directSale,
    });
  }
  return (
    <div id="items">
      <div style={{ textAlign: "center" }}>
        <InputDialog options={inputDialog} setExpanded={setExpanded} />
      </div>
      {props.ItemData.map(
        ({ name, category, price, _id }) =>
          props.category === category && (
            <div
              key={_id}
              className={"item " + props.darkmode}
              onClick={() => updateState(name, Math.round(price), false)}
            >
              <div className="item-content">
                {name}
                <div className="price">{displayPrice(Math.round(price))} €</div>
              </div>
            </div>
          )
      )}
      <div
        key="item-direct"
        className={"item " + props.darkmode}
        onClick={ClickOnDirectSale}
      >
        <div className="item-content">Manual Input</div>
      </div>
    </div>
  );
}

export default ItemsList;
