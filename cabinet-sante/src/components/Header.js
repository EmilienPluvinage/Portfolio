import "../styles/styles.css";
import { Stethoscope } from "tabler-icons-react";
function Header() {
  return (
    <header>
      <h1>
        {" "}
        <Stethoscope
          strokeWidth={"1px"}
          style={{ marginRight: "10px", position: "relative", top: "12px" }}
          size={40}
        />
        Mon Cabinet Santé
      </h1>
    </header>
  );
}

export default Header;
