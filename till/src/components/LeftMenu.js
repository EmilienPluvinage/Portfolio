import "../styles/leftmenu.css";
import OnHold from "./OnHold";
import Staff from "./Staff";

function LeftMenu({ ticketsOnHold, updateTicketsOnHold }) {
  return (
    <nav id="left-menu">
      <ul>
        <li>Configuration</li>
        <li>Statistics</li>
      </ul>
      <OnHold
        ticketsOnHold={ticketsOnHold}
        updateTicketsOnHold={updateTicketsOnHold}
      />
      <Staff />
    </nav>
  );
}

export default LeftMenu;
