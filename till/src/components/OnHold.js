import "../styles/leftmenu.css";

function OnHold({ ticketsOnHold, updateTicketsOnHold }) {
  console.table(ticketsOnHold);
  return (
    <div>
      <div>RECEIPTS</div>
      <div id="tickets-on-hold">
        {ticketsOnHold.map(({ ticket, id }) => (
          <div key={id}>Ticket {id}</div>
        ))}
      </div>
    </div>
  );
}

export default OnHold;
