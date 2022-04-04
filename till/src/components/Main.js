import TopMenu from "./TopMenu";
import ItemsList from "./ItemsList";
import Receipt from "./Receipt";
import "../styles/style.css";
import React from "react";
import { useTheme } from "./ThemeContext";

function Main({
  menu,
  updateMenu,
  ItemData,
  cart,
  updateCart,
  ticket,
  updateTicket,
  totalOfReceipt,
  ticketsOnHold,
  updateTicketsOnHold,
  putOnHold,
  user,
  EmployeeData,
  ContactData,
}) {
  const darkmode = useTheme();
  return (
    <div id="parent2">
      <div id="main" className={darkmode}>
        <div style={{ height: "100%" }}>
          <TopMenu menu={menu} updateMenu={updateMenu} ItemData={ItemData} />
          <ItemsList
            category={menu}
            cart={cart}
            updateCart={updateCart}
            ticket={ticket}
            updateTicket={updateTicket}
            totalOfReceipt={totalOfReceipt}
            ItemData={ItemData}
          />
        </div>
      </div>
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
        EmployeeData={EmployeeData}
        ItemData={ItemData}
        ContactData={ContactData}
      />
    </div>
  );
}

export default Main;
