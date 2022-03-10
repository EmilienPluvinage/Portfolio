import "../styles/leftmenu.css";
import OnHold from "./OnHold";
import Staff from "./Staff";

function LeftMenu({
  cart,
  updateCart,
  ticket,
  updateTicket,
  ticketsOnHold,
  updateTicketsOnHold,
  putOnHold,
}) {
  return (
    <nav id="left-menu">
      <ul>
        <li>Configuration</li>
        <li>Statistics</li>
      </ul>
      <OnHold
        cart={cart}
        updateCart={updateCart}
        ticket={ticket}
        updateTicket={updateTicket}
        ticketsOnHold={ticketsOnHold}
        updateTicketsOnHold={updateTicketsOnHold}
        putOnHold={putOnHold}
      />
      <Staff />
    </nav>
  );
}

export default LeftMenu;
