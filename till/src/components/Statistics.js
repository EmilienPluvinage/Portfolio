import "../styles/statistics.css";
import { displayPrice, displayDate, datesAreOnSameDay } from "./Functions";
import { useState, useEffect } from "react";
import { queryData } from "./Functions";
import DisplayReceipt from "./DisplayReceipt";
import StatisticsMenu from "./StatisticsMenu";
import DropdownMenu from "./DropdownMenu";
import StatisticsOfTheDay from "./StatisticsOfTheDay";

function Statistics(props) {
  const [Receipts, updateReceipts] = useState([]);
  const [displayedReceipt, setDisplayedReceipt] = useState(0);
  const [payementMethod, setPayementMethod] = useState("");
  const [today, setToday] = useState(new Date());
  const [salesDetails, setSalesDetails] = useState(false);

  const payementMethods = Receipts.reduce(
    (acc, item) =>
      acc.includes(item.payement) ? acc : acc.concat(item.payement),
    []
  );

  function sendEmail() {
    fetch("http://localhost:3001/Email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: "text" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function ListOfItemsSold() {
    var list = [];
    var ticket = [];
    var index = function (j) {
      return list.findIndex((e) => e.name === ticket[j].name);
    };
    var ReceiptsOfTheDay = Receipts.filter((receipt) =>
      datesAreOnSameDay(new Date(today), new Date(receipt.time))
    );
    for (let i = 0; i < ReceiptsOfTheDay.length; i++) {
      ticket = JSON.parse(ReceiptsOfTheDay[i].ticket);
      for (let j = 0; j < ticket.length; j++) {
        if (index(j) !== -1) {
          // we increment
          list[index(j)].quantity += ticket[j].quantity;
        } else {
          // we add it
          list.push({ name: ticket[j].name, quantity: ticket[j].quantity });
        }
      }
    }
    return list;
  }

  useEffect(() => {
    queryData(initReceiptsData, "Receipts");
  }, [props.receiptsUpdates]);

  function initReceiptsData(data) {
    updateReceipts(data.reverse());
  }

  function dropdownCallback(value, param1, param2) {
    fetch("http://localhost:3001/Receipt/Payement/" + param1, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payement: value }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        props.setReceiptsUpdates((prev) => prev + 1);
        console.log("ReceiptUpdates++");
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      });
    document.activeElement.blur();
  }

  return (
    <div id="statistics">
      <StatisticsMenu
        today={today}
        setToday={setToday}
        darkmode={props.darkmode}
        Receipts={Receipts}
        salesDetails={salesDetails}
        setSalesDetails={setSalesDetails}
      />
      <div id="statistics-main">
        <div className="statistics-third">
          <div className="payement-filters">
            <div onClick={() => sendEmail()} className="payement-filter">
              E-MAIL
            </div>
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
                  onClick={() =>
                    displayedReceipt !== _id
                      ? setDisplayedReceipt(_id)
                      : setDisplayedReceipt(0)
                  }
                >
                  {displayPrice(total)} € {user} {displayDate(new Date(time))}{" "}
                  {payement.toUpperCase()}
                </div>
              )
          )}
        </div>

        {displayedReceipt !== 0 && (
          <div className="statistics-third" style={{ flex: 0 }}>
            <div
              onClick={() => setDisplayedReceipt(0)}
              className="closing-btn"
              style={{ margin: "10px" }}
            >
              X
            </div>
            <div style={{ textAlign: "center" }}>
              <DisplayReceipt
                ticket={JSON.parse(
                  Receipts.find((e) => e._id === displayedReceipt).ticket
                )}
                cart={Receipts.find((e) => e._id === displayedReceipt).total}
                eatIn={Receipts.find((e) => e._id === displayedReceipt).eatIn}
                ItemData={props.ItemData}
                date={Receipts.find((e) => e._id === displayedReceipt).time}
              />

              <DropdownMenu
                options={payementMethods}
                callback={dropdownCallback}
                name={displayedReceipt}
                param2={""}
                text={
                  <div className="payement-filter">Change Payement Method</div>
                }
                darkmode={props.darkmode}
              />

              <div onClick={() => sendEmail()} className="payement-filter">
                Send Receipt By E-Mail
              </div>
            </div>
          </div>
        )}

        {salesDetails && (
          <div className="statistics-third">
            <div className="print">
              <div
                onClick={() => setSalesDetails(false)}
                className="closing-btn"
              >
                X
              </div>
              <p style={{ textAlign: "center" }}>{displayDate(today, true)}</p>
              <p style={{ textAlign: "center" }}>List of the items sold</p>
              <div>
                {ListOfItemsSold().map(({ name, quantity }) => (
                  <p key={"sold " + name}>
                    {quantity} x {name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="statistics-third">
          <StatisticsOfTheDay
            darkmode={props.darkmode}
            today={today}
            ReceiptsOfTheDay={Receipts.filter((r) =>
              datesAreOnSameDay(new Date(today), new Date(r.time))
            )}
            EmployeeData={props.EmployeeData}
          />
        </div>
      </div>
    </div>
  );
}

export default Statistics;
