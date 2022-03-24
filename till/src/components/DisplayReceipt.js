import "../styles/payementScreen.css";
import { displayPercentage, displayPrice, displayDate } from "./Functions";
import React, { useState } from "react";

function DisplayReceipt({ ticket, cart, eatIn, ItemData, date, setVatTable }) {
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
    var x = function (vat) {
      return newVAT.findIndex((e) => e.rate === vat);
    };
    newVAT = VAT;
    for (let i = 0; i < newVAT.length; i++) {
      newVAT[i].total = 0;
    }
    for (let i = 0; i < receipt.length; i++) {
      var vat;
      if (receipt[i].name !== "Vente Directe") {
        vat =
          eatIn === true
            ? ItemData.find((e) => e.name === receipt[i].name).vatIn
            : ItemData.find((e) => e.name === receipt[i].name).vatOut;
      } else {
        vat = eatIn === true ? 0.1 : 0.055;
      }
      total =
        Math.round(total) +
        Math.round(
          (receipt[i].price * receipt[i].quantity * receipt[i].discount * vat) /
            1000
        );
      newVAT[x(vat)].total += Math.round(
        (receipt[i].price * receipt[i].quantity * receipt[i].discount * vat) /
          1000
      );
    }
    setVatTable(newVAT);
    return total;
  }

  return (
    <div className="print">
      <p>Adress</p>
      <p>Phone Number</p>
      <p>
        {date !== undefined
          ? displayDate(new Date(date))
          : displayDate(new Date())}
      </p>
      <p>{eatIn ? "EAT IN" : "TAKE AWAY"}</p>
      <div
        className="receipt-summary"
        style={{ borderBottom: "1px solid black" }}
      >
        <div className="receipt-left-side">
          {ticket.map(({ name, quantity, discount }) => (
            <span key={"displayreceiptleft" + name}>
              <span key={name + "left"}>
                {quantity} x {name}
                <br />
              </span>
              {discount !== 1 ? (
                <span
                  key={discount + name + "left"}
                  style={{ fontStyle: "oblique" }}
                >
                  Discount <br />
                </span>
              ) : (
                ""
              )}
            </span>
          ))}
        </div>
        <div className="receipt-right-side">
          {ticket.map(({ name, price, quantity, discount }) => (
            <span key={"displayreceiptright" + name}>
              <span key={name + "right"}>
                {displayPrice(Math.round(price * quantity * discount)) + " € "}
                <br />
              </span>
              {discount !== 1 ? (
                <span
                  key={discount + name + "right"}
                  style={{ fontStyle: "oblique" }}
                >
                  -
                  {displayPercentage(
                    Math.round((1 - discount) * 10000) / 10000
                  )}{" "}
                  <br />
                </span>
              ) : (
                ""
              )}
            </span>
          ))}
        </div>
      </div>
      <div className="receipt-summary">
        <div className="receipt-left-side">TOTAL</div>
        <div className="receipt-right-side">{displayPrice(cart)} €</div>
      </div>
      <table style={{ margin: "auto", minWidth: "50%" }}>
        <thead>
          <tr>
            <td style={{ textAlign: "left" }}>VAT %</td>
            <td style={{ textAlign: "right" }}>VAT €</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: "left" }}>TOTAL</td>
            <td style={{ textAlign: "right" }}>
              {displayPrice(calculateVAT(ticket))} €
            </td>
          </tr>
          {VAT.map(({ rate, total }) => (
            <tr key={rate}>
              <td style={{ textAlign: "left" }}>
                {displayPercentage(rate / 1000)}
              </td>
              <td style={{ textAlign: "right" }}>{displayPrice(total)} €</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Thanks for your visit.</p>
    </div>
  );
}

export default DisplayReceipt;
