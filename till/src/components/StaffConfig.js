import "../styles/item.css";
import "../styles/config.css";
import { useState } from "react";
import InputDialog from "./InputDialog";

function StaffConfig({
  configMenu,
  updateConfigMenu,
  darkmode,
  EmployeeData,
  staffUpdates,
  setStaffUpdates,
}) {
  const [inputDialog, updateInputDialog] = useState({
    open: false,
    name: "",
    type: "text",
    text: "",
    callback: null,
  });

  function setExpanded(bool) {
    updateInputDialog({
      open: bool,
      name: inputDialog.name,
      type: inputDialog.type,
      text: inputDialog.text,
      callback: inputDialog.callback,
    });
  }

  function updateStaffName(name) {
    alert("Modifier nom de " + name);
  }

  function updateStaffColor(name) {
    alert("Modifier couleur de " + name);
  }

  function deleteStaff(name) {
    console.log("supprimer " + name);
    fetch("http://localhost:3001/Staff-" + name, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      });
    setStaffUpdates(staffUpdates + 1);
  }

  function addStaff() {
    updateInputDialog({
      open: true,
      name: "",
      type: "text",
      text: "Select employee name :",
      callback: addStaffMember,
    });
  }

  function addStaffMember(v, name) {
    console.log("Ajouter de " + name);
    fetch("http://localhost:3001/Staff/" + name + "/skyblue", {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      });
    setStaffUpdates(staffUpdates + 1);
  }
  return (
    configMenu === "Staff" && (
      <div id="items">
        <div style={{ textAlign: "center" }}>
          <InputDialog options={inputDialog} setExpanded={setExpanded} />
        </div>
        <div className={"item " + darkmode} onClick={() => addStaff()}>
          <div className="item-content">+ Add</div>
        </div>
        {EmployeeData.map(({ _id, name, color }) => (
          <div
            key={_id}
            className={"config-item " + darkmode}
            style={{ borderColor: color }}
          >
            <div className="config-item-content">
              {name}
              <div className="config-buttons">
                <div
                  className={"config-btn " + darkmode}
                  onClick={() => updateStaffName(name)}
                >
                  Change Name
                </div>
                <div
                  className={"config-btn " + darkmode}
                  onClick={() => updateStaffColor(name)}
                >
                  Change Color
                </div>
                <div
                  className={"config-btn " + darkmode}
                  onClick={() => deleteStaff(name)}
                >
                  Delete
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  );
}

export default StaffConfig;
