import "../styles/payementScreen.css";
import { displayPrice } from "./Functions";
import React from "react";
import DisplayReceipt from "./DisplayReceipt";

function PayementScreen(props) {
  function close() {
    props.setExpanded(false);
  }

  return props.options.open ? (
    <div className="payement-screen">
      <div className="payement-content">
        <div className="billing">
          <div className="final-price">
            Total : {displayPrice(props.cart)} €
          </div>
          <div className="payement-options">
            <div className="payement-option">Cash</div>
            <div className="payement-option">Credit Card</div>
          </div>
          <div className="other-options">
            <div className="other-option" onClick={close}>
              Cancel
            </div>
          </div>
        </div>
        <DisplayReceipt
          ticket={props.ticket}
          cart={props.cart}
          eatIn={props.options.vat === "in"}
        />
      </div>
    </div>
  ) : null;
}

export default PayementScreen;
