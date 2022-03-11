import "../styles/leftmenu.css";
import { EmployeeData } from "../datas/EmployeeData";

function Staff({ user, updateUser }) {
  return (
    <div>
      <div>STAFF</div>
      <div id="tickets-on-hold">
        {EmployeeData.map(({ name, color }) => (
          <div
            key={name}
            style={
              name === user
                ? { color: color, backgroundColor: "lightgray" }
                : { color: color }
            }
            className="ticket"
            onClick={() => updateUser(name)}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Staff;
