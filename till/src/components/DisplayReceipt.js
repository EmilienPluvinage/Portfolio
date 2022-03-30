import "../styles/payementScreen.css";
import { displayPercentage, displayPrice, displayDate } from "./Functions";
import React from "react";

function DisplayReceipt({
  ticket,
  cart,
  eatIn,
  ItemData,
  date,
  vatTable,
  ContactData,
}) {
  const origin = vatTable?.current === undefined ? "Statistics" : "Main Screen";

  const VATrates =
    origin === "Main Screen" ? getVATrates() : vatTable.map((a) => a.rate);
  const VAT = origin === "Main Screen" ? initVAT() : vatTable;

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

  function calculateVATfromMainScreen(receipt) {
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
      if (receipt[i].name !== "Manual Input") {
        vat =
          eatIn === true
            ? ItemData.find((e) => e.name === receipt[i].name).vatIn
            : ItemData.find((e) => e.name === receipt[i].name).vatOut;
      } else {
        // really not clean way of doing it ... but for now it'll do
        vat = eatIn === true ? 100 : 55;
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

    vatTable.current = newVAT;

    return total;
  }

  function calculateVATfromStatistics() {
    // we loop on the ticket, calculate the VAT for each item add populate the array VAT adequately
    // then returns the total

    var total = 0;
    var newVAT = VAT;
    for (let i = 0; i < newVAT.length; i++) {
      total += newVAT[i].total;
    }

    return total;
  }

  return (
    <div className="print">
      <div style={{ whiteSpace: "pre-line" }}>
        <p>{ContactData[0].address}</p>
      </div>
      <p>{ContactData[0].phone}</p>
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
              <span
                key={name + "left"}
                style={{ whiteSpace: "nowrap", overflow: "hidden" }}
              >
                {" "}
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
              <span
                key={name + "right"}
                style={{ whiteSpace: "nowrap", overflow: "hidden" }}
              >
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
              {displayPrice(
                origin === "Main Screen"
                  ? calculateVATfromMainScreen(ticket)
                  : calculateVATfromStatistics()
              )}{" "}
              €
            </td>
          </tr>
          {VAT.sort((a, b) => (a.rate < b.rate ? -1 : 1)).map(
            ({ rate, total }) => (
              <tr key={rate}>
                <td style={{ textAlign: "left" }}>
                  {displayPercentage(rate / 1000)}
                </td>
                <td style={{ textAlign: "right" }}>{displayPrice(total)} €</td>
              </tr>
            )
          )}
        </tbody>
      </table>
      <p>Thanks for your visit.</p>
    </div>
  );
}

export default DisplayReceipt;
