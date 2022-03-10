import "../styles/style.css";
import "../styles/item.css";
import "../styles/leftmenu.css";
import "../styles/receipt.css";
import "../styles/topmenu.css";
import Header from "./Header";
import LeftMenu from "./LeftMenu";
import Receipt from "./Receipt";
import TopMenu from "./TopMenu";
import ItemsList from "./ItemsList";
import { useState } from "react";

function App() {
  const [cart, updateCart] = useState(0);
  const [menu, updateMenu] = useState("Viennoiserie");
  const [ticket, updateTicket] = useState([]);
  const [ticketsOnHold, updateTicketsOnHold] = useState([]);
  console.log("ticket App");
  console.table(ticket);

  function putOnHold() {
    console.log("PUTTING ON HOLD");
    // we're going to add a new ticket in local storage
    // we need to make sure we don't do it if there's an empty ticket

    if (ticket.length !== 0) {
      // changer la manière de définir l'id en prenant le plus grand id + 1 (plutôt que length);
      var id = ticketsOnHold.length + 1;
      ticketsOnHold.push({ ticket, id });
      updateCart(0);
      updateTicket([]);
      console.log("ticket putOnHold");
      console.table(ticket);
    }
  }

  return (
    <div id="parent">
      <Header />
      <LeftMenu
        cart={cart}
        updateCart={updateCart}
        ticket={ticket}
        updateTicket={updateTicket}
        ticketsOnHold={ticketsOnHold}
        updateTicketsOnHold={updateTicketsOnHold}
        putOnHold={putOnHold}
      />
      <Receipt
        cart={cart}
        updateCart={updateCart}
        ticket={ticket}
        updateTicket={updateTicket}
        ticketsOnHold={ticketsOnHold}
        updateTicketsOnHold={updateTicketsOnHold}
        putOnHold={putOnHold}
      />
      <div id="main">
        <TopMenu menu={menu} updateMenu={updateMenu} />
        <ItemsList
          category={menu}
          cart={cart}
          updateCart={updateCart}
          ticket={ticket}
          updateTicket={updateTicket}
        />
      </div>
    </div>
  );
}

export default App;
