import "../styles/leftmenu.css";

function Staff({ user, updateUser, EmployeeData }) {
  return (
    <div>
      <div>STAFF</div>
      <div id="tickets-on-hold">
        {EmployeeData.map(({ _id, name, color }) => (
          <div key={name + "parent"}>
            <div
              key={name}
              style={
                name === user
                  ? { color: "white", backgroundColor: color, fontWeight: 300 }
                  : { fontWeight: 300 }
              }
              className="staff-member"
              onClick={() => updateUser(name)}
            >
              &nbsp;{name}
            </div>
            <div
              className="staff-color"
              key={color}
              style={{ backgroundColor: color }}
            >
              &nbsp;
            </div>
            <div style={{ clear: "both" }}></div>
          </div>
        ))}
      </div>{" "}
    </div>
  );
}

export default Staff;
