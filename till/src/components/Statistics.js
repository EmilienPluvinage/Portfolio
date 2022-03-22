import "../styles/statistics.css";
import { displayPrice } from "./Functions";
import { useState, useEffect } from "react";
import { queryData } from "./Functions";
import DisplayReceipt from "./DisplayReceipt";

function Statistics(props) {
  const [Receipts, updateReceipts] = useState([]);
  const [displayedReceipt, setDisplayedReceipt] = useState(0);
  const [payementMethod, setPayementMethod] = useState("");

  const payementMethods = Receipts.reduce(
    (acc, item) =>
      acc.includes(item.payement) ? acc : acc.concat(item.payement),
    []
  );

  useEffect(() => {
    queryData(initReceiptsData, "Receipts");
  }, [props.receiptsUpdates]);

  function initReceiptsData(data) {
    updateReceipts(data.reverse());
  }

  function cart(receipt) {
    var total = 0;
    for (let i = 0; i < receipt.length; i++) {
      total =
        Math.round(total) +
        Math.round(
          receipt[i].price * receipt[i].discount * receipt[i].quantity
        );
    }
    return total;
  }
  // basically we need to get all the receipts for today, and then display them
  return (
    <div id="statistics">
      <div id="statistics-header"></div>
      <div id="statistics-main">
        <div className="statistics-third">
          <div className="payement-filters">
            {payementMethods.map((method) => (
              <div
                className="payement-filter"
                key={method}
                onClick={() =>
                  payementMethod !== method
                    ? setPayementMethod(method)
                    : setPayementMethod("")
                }
                style={
                  payementMethod === method
                    ? { backgroundColor: "rgb(220, 245, 255)" }
                    : null
                }
              >
                {method}
              </div>
            ))}
          </div>
          {Receipts.map(
            ({ total, time, _id, payement, user }) =>
              (payement === payementMethod || payementMethod === "") && (
                <div
                  style={
                    _id === displayedReceipt
                      ? { backgroundColor: "rgb(220, 245, 255)" }
                      : null
                  }
                  key={_id}
                  className="individual-receipts"
                  onClick={() => setDisplayedReceipt(_id)}
                >
                  {displayPrice(total)} € {user} {time} {payement.toUpperCase()}
                </div>
              )
          )}
        </div>
        <div
          className="statistics-third"
          style={{ textAlign: "center", padding: "20px" }}
        >
          {displayedReceipt !== 0 && (
            <DisplayReceipt
              ticket={JSON.parse(
                Receipts.find((e) => e._id === displayedReceipt).ticket
              )}
              cart={cart(
                JSON.parse(
                  Receipts.find((e) => e._id === displayedReceipt).ticket
                )
              )}
              eatIn={Receipts.find((e) => e._id === displayedReceipt).eatIn}
              ItemData={props.ItemData}
            />
          )}
        </div>
        <div className="statistics-third">aggregate of the day</div>
      </div>
    </div>
  );
}

export default Statistics;
