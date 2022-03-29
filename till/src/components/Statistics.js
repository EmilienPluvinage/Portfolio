import "../styles/statistics.css";
import {
  displayPrice,
  displayDate,
  datesAreOnSameDay,
  displayTime,
} from "./Functions";
import { useState, useEffect } from "react";
import { queryData } from "./Functions";
import DisplayReceipt from "./DisplayReceipt";
import StatisticsMenu from "./StatisticsMenu";
import DropdownMenu from "./DropdownMenu";
import StatisticsOfTheDay from "./StatisticsOfTheDay";
import ReactDomServer from "react-dom/server";
import raw from "../styles/EmailCSS.txt";
import close from "../img/close.png";
import closeHover from "../img/close-hover.png";

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

  function sendEmail(id) {
    var receipt = Receipts.find((e) => (e._id = id));
    var html = ReactDomServer.renderToStaticMarkup(
      <DisplayReceipt
        ticket={JSON.parse(receipt.ticket)}
        cart={receipt.total}
        eatIn={receipt.eatIn}
        ItemData={props.ItemData}
        date={receipt.time}
        ContactData={props.ContactData}
      />
    );
    var style = "";
    fetch(raw)
      .then((r) => r.text())
      .then((text) => {
        style = '<div style="' + text + '">';
        var subject = "Receipt " + displayDate(new Date(receipt.time));

        fetch("http://localhost:3001/Email/" + process.env.REACT_APP_API_KEY, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: "emilien.pluvinage@gmail.com",
            subject: subject,
            textcontent: "text",
            htmlcontent: style + html + "</div>",
          }),
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
    // set today at the last date for which there was receipts
    setToday(new Date(data[0]?.time));
  }

  function dropdownCallback(value, param1, param2) {
    fetch(
      "http://localhost:3001/Receipt/Payement/" +
        param1 +
        "/" +
        process.env.REACT_APP_API_KEY,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payement: value }),
      }
    )
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
        <div className={"statistics-third " + props.darkmode}>
          <div className="payement-filters">
            {payementMethods.map((method) => (
              <div
                className={
                  "payement-filter " +
                  props.darkmode +
                  " " +
                  (payementMethod === method ? "clicked" : "")
                }
                key={method}
                onClick={() =>
                  payementMethod !== method
                    ? setPayementMethod(method)
                    : setPayementMethod("")
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
                  key={_id}
                  className={
                    "individual-receipts " +
                    props.darkmode +
                    " " +
                    (_id === displayedReceipt ? "clicked" : "")
                  }
                  onClick={() =>
                    displayedReceipt !== _id
                      ? setDisplayedReceipt(_id)
                      : setDisplayedReceipt(0)
                  }
                >
                  <div className="receipts-parts">
                    <div className="individual-other">
                      {displayDate(new Date(time), true)} <br />
                      {displayTime(new Date(time))}
                    </div>
                  </div>

                  <div className="receipts-parts">
                    <div className="individual-total">
                      {displayPrice(total)} €
                    </div>
                  </div>

                  <div className="receipts-parts">
                    <div className="individual-other">
                      {user}
                      <br />
                      {payement}
                    </div>
                  </div>
                </div>
              )
          )}
        </div>

        {displayedReceipt !== 0 && (
          <div
            className={"statistics-third " + props.darkmode}
            style={{ width: "max-content" }}
          >
            <div onClick={() => setDisplayedReceipt(0)} className="closing-btn">
              <img
                src={close}
                alt="close"
                height="12px"
                onMouseOver={(e) => (e.currentTarget.src = closeHover)}
                onMouseOut={(e) => (e.currentTarget.src = close)}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              {console.log(Receipts.find((e) => e._id === displayedReceipt))}
              <DisplayReceipt
                ticket={JSON.parse(
                  Receipts.find((e) => e._id === displayedReceipt).ticket
                )}
                cart={Receipts.find((e) => e._id === displayedReceipt).total}
                eatIn={Receipts.find((e) => e._id === displayedReceipt).eatIn}
                ItemData={props.ItemData}
                date={Receipts.find((e) => e._id === displayedReceipt).time}
                vatTable={undefined}
                ContactData={props.ContactData}
              />

              <DropdownMenu
                options={payementMethods}
                callback={dropdownCallback}
                name={displayedReceipt}
                param2={""}
                text={
                  <div className={"payement-filter " + props.darkmode}>
                    Change Payement Method
                  </div>
                }
                darkmode={props.darkmode}
              />

              <div
                onClick={() =>
                  props.demoMode
                    ? alert("Disabled in demonstration mode.")
                    : sendEmail(displayedReceipt)
                }
                className={"payement-filter " + props.darkmode}
              >
                Send Receipt By E-Mail
              </div>
            </div>
          </div>
        )}

        {salesDetails && (
          <div className={"statistics-third " + props.darkmode}>
            <div className="statistics-breakdown">
              <p style={{ textAlign: "center", textDecoration: "underline" }}>
                items sold on the {displayDate(today, true)}
              </p>
              <div>
                {ListOfItemsSold().map(({ name, quantity }) => (
                  <span key={"sold " + name}>
                    {quantity} {name}
                    <br />
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className={"statistics-third " + props.darkmode}>
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
