import "../styles/payementScreen.css";
import { displayPercentage, displayPrice } from "./Functions";
import React, { useState } from "react";
import { ItemData } from "../datas/ItemData";

function PayementScreen(props) {
  const VATrates = getVATrates();
  const [VAT, updateVAT] = useState(initVAT());

  function getVATrates() {
    // lists all the possible VAT rates based on the items data list
    var VATratesIn = ItemData.reduce(
      (acc, item) => (acc.includes(item.vatIn) ? acc : acc.concat(item.vatIn)),
      []
    );

    var VATratesBoth = ItemData.reduce(
      (acc, item) =>
        acc.includes(item.vatOut) ? acc : acc.concat(item.vatOut),
      VATratesIn
    );
    return VATratesBoth;
  }

  function initVAT() {
    // inits the sum of VAT to 0 for each VAT rate
    var initVAT = [];
    for (let i = 0; i < VATrates.length; i++) {
      initVAT.push({ rate: VATrates[i], total: 0 });
    }
    return initVAT;
  }

  function calculateVAT(receipt) {
    // we loop on the ticket, calculate the VAT for each item add populate the array VAT adequately
    // then returns the total
    var total = 0;
    var newVAT = [];
    var x = 0;
    newVAT = VAT;
    for (let i = 0; i < newVAT.length; i++) {
      newVAT[i].total = 0;
    }
    for (let i = 0; i < receipt.length; i++) {
      var vat =
        props.options.vat === "in"
          ? ItemData.find((e) => e.name === receipt[i].name).vatIn
          : ItemData.find((e) => e.name === receipt[i].name).vatOut;
      total =
        Math.round(total) +
        Math.round(receipt[i].price * receipt[i].quantity * vat);

      x = newVAT.findIndex((e) => e.rate === vat);
      newVAT[x].total += Math.round(
        receipt[i].price * receipt[i].quantity * vat
      );
    }
    return total;
  }

  function close() {
    props.setExpanded(false);
  }

  return props.options.open ? (
    <div className="payement-screen">
      <div className="payement-content">
        <div className="billing">
          <div className="final-price">
            Total {props.options.vat} : {displayPrice(props.cart)} €
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
          <table style={{ margin: "auto" }}>
            <tr>
              <td>VAT %</td>
              <td>VAT €</td>
            </tr>
            <tr>
              <td>TOTAL</td>
              <td>{displayPrice(calculateVAT(props.ticket))} €</td>
            </tr>
            {VAT.map(({ rate, total }) => (
              <tr>
                <td>{displayPercentage(rate)}</td>
                <td>{displayPrice(total)} €</td>
              </tr>
            ))}
          </table>
          <p>Thanks for your visit.</p>
        </div>
      </div>
    </div>
  ) : null;
}

export default PayementScreen;
