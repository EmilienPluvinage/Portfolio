import "../styles/payementScreen.css";
import { displayPrice } from "./Functions";
import React from "react";
import DisplayReceipt from "./DisplayReceipt";
import { useRef } from "react";
import { useTheme } from "./ThemeContext";

function PayementScreen(props) {
  const darkmode = useTheme();

  const vatTable = useRef([]);

  function close() {
    props.setExpanded(false);
  }

  function finaliseTransaction(payement) {
    var ReceiptToStore = {
      ticket: JSON.stringify(props.ticket),
      total: props.cart,
      time: Date.now(),
      eatIn: props.options.vat === "in",
      payement: payement,
      user: props.user,
      vatTable: JSON.stringify(vatTable.current),
    };
    fetch(
      process.env.REACT_APP_API_DOMAIN +
        "/Receipt/" +
        process.env.REACT_APP_API_KEY,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ReceiptToStore),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        props.Clear();
        close();
        return response.json();
      })

      .catch((err) => {
        console.log(err.message);
      });
  }

  return props.options.open ? (
    <div className="payement-screen">
      <div className={"payement-content " + darkmode}>
        <div className="billing">
          <div className={"final-price " + darkmode}>
            Total : {displayPrice(props.cart)} €
          </div>
          <div className="payement-options">
            <div
              className="payement-option"
              onClick={() => finaliseTransaction("cash")}
            >
              Cash
            </div>
            <div
              className="payement-option"
              onClick={() => finaliseTransaction("credit card")}
            >
              Credit Card
            </div>
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
          ItemData={props.ItemData}
          vatTable={vatTable}
          ContactData={props.ContactData}
        />
      </div>
    </div>
  ) : null;
}

export default PayementScreen;
