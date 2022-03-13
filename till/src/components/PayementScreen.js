import "../styles/payementScreen.css";
import { displayPrice } from "./Functions";
import React, { useState } from "react";

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
        <div className="print">
          <p>RECEIPT</p>
          <p>Adress</p>
          <p>Phone Number</p>
          <p> Date and Time</p>
          <div style={{ textAlign: "left" }}>
            {props.ticket.map(({ name, price, quantity }) => (
              <p key={name}>
                {displayPrice(price * quantity) +
                  " € " +
                  name +
                  " x " +
                  quantity}
              </p>
            ))}
          </div>
          <p>Total : {displayPrice(props.cart)} €</p>
          <p>VAT Breakdown</p>
          <p>Thanks for your visit.</p>
        </div>
      </div>
    </div>
  ) : null;
}

export default PayementScreen;
