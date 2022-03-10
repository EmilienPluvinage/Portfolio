import "../styles/leftmenu.css";

function OnHold({
  cart,
  updateCart,
  ticket,
  updateTicket,
  ticketsOnHold,
  updateTicketsOnHold,
  putOnHold,
}) {
  function OffHold(n) {
    // we put on hold the current receipt if there is one
    putOnHold(ticket);

    var ticketToReload = ticketsOnHold.find((e) => e.id === n).ticket;
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
  }
  return (
    <div>
      <div>RECEIPTS</div>
      <div id="tickets-on-hold">
        {ticketsOnHold.map(({ id }) => (
          <div onClick={() => OffHold(id)} className="ticket" key={id}>
            Receipt {id}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OnHold;
