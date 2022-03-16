import "../styles/leftmenu.css";
import "../styles/switch.css";
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
  darkmode,
  updateDarkMode,
}) {
  function setDarkMode(event) {
    if (event.target.checked) {
      updateDarkMode("dark");
    } else {
      updateDarkMode("light");
    }
  }
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
      <div style={{ textAlign: "center" }}>DARK MODE</div>
      <div id="dark-mode-switch">
        <input
          className="toggle"
          checked={darkmode === "dark" && "checked"}
          type="checkbox"
          onChange={setDarkMode}
        />
      </div>
    </nav>
  );
}

export default LeftMenu;
