import "../styles/leftmenu.css";

function LeftMenu() {
  return (
    <nav id="left-menu">
      <ul>
        <li>Configuration</li>
        <li>Statistics</li>
      </ul>
      <div>RECEIPTS</div>
      <div id="tickets-on-hold">
        <div>Receipt 1</div>
        <div>Receipt 2</div>
        <div>Receipt 1</div>
        <div>Receipt 2</div>
        <div>Receipt 1</div>
        <div>Receipt 2</div>
      </div>
      <div>EMPLOYEES</div>
      <div id="tickets-on-hold">
        <div>Employee 1</div>
        <div>Employee 2</div>
      </div>
    </nav>
  );
}

export default LeftMenu;
