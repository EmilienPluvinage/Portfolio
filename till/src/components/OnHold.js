import "../styles/leftmenu.css";
import { EmployeeData } from "../datas/EmployeeData";

function OnHold({
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
  function OffHold(n) {
    // we put on hold the current receipt if there is one
    putOnHold(ticket);

    var ticketToReload = ticketsOnHold.find((e) => e.id === n).ticket;
    var colorToReload = ticketsOnHold.find((e) => e.id === n).color;

    // now we can reload our ticket number n that was on hold
    updateTicket(ticketToReload);
    // we calculate the cart total before displaying anything based on the current ticket
    var total = 0;
    for (let i = 0; i < ticketToReload.length; i++) {
      total += ticketToReload[i].price * ticketToReload[i].quantity;
    }
    updateCart(total);

    // finally we remove it from the OnHold list
    var NewTicketsOnHold = ticketsOnHold.filter((value) => value.id !== n);
    updateTicketsOnHold(NewTicketsOnHold);

    // we also change the user to correspond to the one who'd put the ticket on hold
    updateUser(EmployeeData.find((e) => e.color === colorToReload).name);
  }
  return (
    <div>
      <div>ON HOLD</div>
      <div id="tickets-on-hold">
        {ticketsOnHold.map(({ id, color }) => (
          <div
            onClick={() => OffHold(id)}
            className="ticket"
            key={id}
            style={{ color: color }}
          >
            Receipt {id}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OnHold;
