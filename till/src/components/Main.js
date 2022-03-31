import TopMenu from "./TopMenu";
import ItemsList from "./ItemsList";
import Receipt from "./Receipt";
import "../styles/style.css";

function Main({
  menu,
  updateMenu,
  darkmode,
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
  return (
    <div id="parent2">
      <div id="main" className={darkmode}>
        <div style={{ height: "100%" }}>
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
        darkmode={darkmode}
        EmployeeData={EmployeeData}
        ItemData={ItemData}
        ContactData={ContactData}
      />
    </div>
  );
}

export default Main;
