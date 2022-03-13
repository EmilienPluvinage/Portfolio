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
  user,
  updateUser,
}) {
  return (
    <nav id="left-menu">
      <h2>Till App</h2>
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
        user={user}
        updateUser={updateUser}
      />
      <Staff user={user} updateUser={updateUser} />
    </nav>
  );
}

export default LeftMenu;
