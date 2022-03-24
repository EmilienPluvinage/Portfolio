import "../styles/statistics.css";
import { displayPrice, displayDate, datesAreOnSameDay } from "./Functions";
import { useState, useEffect } from "react";
import { queryData } from "./Functions";
import DisplayReceipt from "./DisplayReceipt";
import StatisticsMenu from "./StatisticsMenu";

function Statistics(props) {
  const [Receipts, updateReceipts] = useState([]);
  const [displayedReceipt, setDisplayedReceipt] = useState(0);
  const [payementMethod, setPayementMethod] = useState("");
  const [today, setToday] = useState(new Date());

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
    setDisplayedReceipt(data[0]._id);
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
      <StatisticsMenu
        today={today}
        setToday={setToday}
        darkmode={props.darkmode}
        Receipts={Receipts}
      />
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
              (payement === payementMethod || payementMethod === "") &&
              datesAreOnSameDay(new Date(today), new Date(time)) && (
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
                  {displayPrice(total)} € {user} {displayDate(new Date(time))}{" "}
                  {payement.toUpperCase()}
                </div>
              )
          )}
        </div>
        <div
          className="statistics-third"
          style={{ textAlign: "center", flex: 0 }}
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
              date={Receipts.find((e) => e._id === displayedReceipt).time}
            />
          )}
        </div>
        <div className="statistics-third">aggregate of the day</div>
      </div>
    </div>
  );
}

export default Statistics;
