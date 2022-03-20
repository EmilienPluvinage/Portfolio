import "../styles/style.css";
import LeftMenu from "./LeftMenu";
import Receipt from "./Receipt";
import TopMenu from "./TopMenu";
import ConfigurationMenu from "./ConfigurationMenu";
import ItemsList from "./ItemsList";
import { useState, useEffect } from "react";
import React from "react";

function App() {
  const [cart, updateCart] = useState(0);
  const [menu, updateMenu] = useState("Viennoiserie");
  const [configMenu, updateConfigMenu] = useState("Staff");
  const [ticket, updateTicket] = useState([]);
  const [ticketsOnHold, updateTicketsOnHold] = useState([]);
  const [darkmode, updateDarkMode] = useState(
    localStorage.getItem("darkmode") || "light"
  );
  const [EmployeeData, setEmployeeData] = useState([]);
  const [ItemData, setItemData] = useState([]);
  const [user, updateUser] = useState([]);
  // user is defaulted to the first person in EmployeeData
  const [page, setPage] = useState("Main");
  // page can take 3 Values so far: Main, Configuration, Statistics.

  useEffect(() => {
    localStorage.setItem("darkmode", darkmode);
  }, [darkmode]);

  useEffect(() => {
    fetch(`http://localhost:3001/Staff`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData) => initEmployeeData(actualData))
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3001/Items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((actualData) => setItemData(actualData))
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  function initEmployeeData(data) {
    setEmployeeData(data);
    updateUser(data[0].name);
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
        page={page}
        setPage={setPage}
      />
      {page === "Main" && (
        <Receipt
          cart={cart}
          updateCart={updateCart}
          ticket={ticket}
          updateTicket={updateTicket}
          ticketsOnHold={ticketsOnHold}
          updateTicketsOnHold={updateTicketsOnHold}
          putOnHold={putOnHold}
          totalOfReceipt={totalOfReceipt}
          user={user}
          darkmode={darkmode}
          EmployeeData={EmployeeData}
          ItemData={ItemData}
        />
      )}
      <div id="main" className={darkmode}>
        {page === "Main" && (
          <div>
            <TopMenu
              menu={menu}
              updateMenu={updateMenu}
              darkmode={darkmode}
              ItemData={ItemData}
            />
            <ItemsList
              category={menu}
              cart={cart}
              updateCart={updateCart}
              ticket={ticket}
              updateTicket={updateTicket}
              totalOfReceipt={totalOfReceipt}
              darkmode={darkmode}
              ItemData={ItemData}
            />
          </div>
        )}
        {page === "Configuration" && (
          <ConfigurationMenu
            configMenu={configMenu}
            updateConfigMenu={updateConfigMenu}
            darkmode={darkmode}
            ItemData={ItemData}
          />
        )}
      </div>
    </div>
  );
}

export default App;
