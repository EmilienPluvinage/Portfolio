import "../styles/style.css";
import LeftMenu from "./LeftMenu";
import Config from "./Config";
import Main from "./Main";
import { useState, useEffect } from "react";
import React from "react";
import { queryData } from "./Functions";
import Statistics from "./Statistics";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [cart, updateCart] = useState(0);
  const [menu, updateMenu] = useState("");
  const [ticket, updateTicket] = useState([]);
  const [ticketsOnHold, updateTicketsOnHold] = useState([]);
  const [darkmode, updateDarkMode] = useState(
    localStorage.getItem("darkmode") || "light"
  );
  const [EmployeeData, setEmployeeData] = useState([]);
  const [staffUpdates, setStaffUpdates] = useState(0);
  const [itemUpdates, setItemUpdates] = useState(0);
  const [receiptsUpdates, setReceiptsUpdates] = useState(0);
  const [ContactData, setContactData] = useState([]);
  const [contactDataUpdates, setContactDataUpdates] = useState(0);
  const [ItemData, setItemData] = useState([]);
  const [user, updateUser] = useState([]);
  const demoMode = process.env.REACT_APP_DEMO_MODE;

  useEffect(() => {
    localStorage.setItem("darkmode", darkmode);
  }, [darkmode]);

  useEffect(() => {
    queryData(initEmployeeData, "Staff");
  }, [staffUpdates]);

  useEffect(() => {
    queryData(initItemData, "Items");
  }, [itemUpdates]);

  useEffect(() => {
    queryData(initContactData, "Contact");
  }, [contactDataUpdates]);

  function initEmployeeData(data) {
    setEmployeeData(data);
    updateUser(data[0].name);
  }

  function initItemData(data) {
    setItemData(data);
    updateMenu(data[0].category);
  }

  function initContactData(data) {
    setContactData(data);
  }

  function putOnHold() {
    // we're going to add a new ticket in local storage
    if (ticket.length !== 0) {
      var id = 0;
      if (ticketsOnHold.length > 0) {
        id =
          Math.max.apply(
            Math,
            ticketsOnHold.map(function (e) {
              return e.id;
            })
          ) + 1;
      } else {
        id = 1;
      }
      var color = EmployeeData.find((e) => e.name === user).color;
      ticketsOnHold.push({ ticket, id, color });
      updateCart(0);
      updateTicket([]);
    }
  }

  function totalOfReceipt(receipt) {
    var total = 0;
    for (let i = 0; i < receipt.length; i++) {
      total =
        Math.round(total) +
        Math.round(
          receipt[i].price * receipt[i].discount * receipt[i].quantity
        );
    }
    updateCart(total);
  }

  return (
    <div id="parent">
      <Router>
        <LeftMenu
          cart={cart}
          updateCart={updateCart}
          ticket={ticket}
          updateTicket={updateTicket}
          ticketsOnHold={ticketsOnHold}
          updateTicketsOnHold={updateTicketsOnHold}
          putOnHold={putOnHold}
          user={user}
          updateUser={updateUser}
          darkmode={darkmode}
          updateDarkMode={updateDarkMode}
          EmployeeData={EmployeeData}
        />

        <Routes>
          <Route
            exact
            path="/"
            element={
              <Main
                menu={menu}
                updateMenu={updateMenu}
                darkmode={darkmode}
                ItemData={ItemData}
                cart={cart}
                updateCart={updateCart}
                ticket={ticket}
                updateTicket={updateTicket}
                totalOfReceipt={totalOfReceipt}
                ticketsOnHold={ticketsOnHold}
                updateTicketsOnHold={updateTicketsOnHold}
                putOnHold={putOnHold}
                user={user}
                EmployeeData={EmployeeData}
                ContactData={ContactData}
              />
            }
          ></Route>
          <Route
            path="/Configuration/:section"
            element={
              <Config
                darkmode={darkmode}
                EmployeeData={EmployeeData}
                staffUpdates={staffUpdates}
                setStaffUpdates={setStaffUpdates}
                demoMode={demoMode}
                setItemUpdates={setItemUpdates}
                ItemData={ItemData}
                itemUpdates={itemUpdates}
                ContactData={ContactData}
                contactDataUpdates={contactDataUpdates}
                setContactDataUpdates={setContactDataUpdates}
              />
            }
          ></Route>
          <Route
            path="/Configuration"
            element={
              <Config
                darkmode={darkmode}
                EmployeeData={EmployeeData}
                staffUpdates={staffUpdates}
                setStaffUpdates={setStaffUpdates}
                demoMode={demoMode}
                setItemUpdates={setItemUpdates}
                ItemData={ItemData}
                itemUpdates={itemUpdates}
                ContactData={ContactData}
                contactDataUpdates={contactDataUpdates}
                setContactDataUpdates={setContactDataUpdates}
              />
            }
          ></Route>
          <Route
            path="/statistics"
            element={
              <Statistics
                receiptsUpdates={receiptsUpdates}
                setReceiptsUpdates={setReceiptsUpdates}
                ItemData={ItemData}
                EmployeeData={EmployeeData}
                ContactData={ContactData}
                demoMode={demoMode}
                darkmode={darkmode}
              />
            }
          ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
