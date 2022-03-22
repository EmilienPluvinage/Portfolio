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

  function updateStaff(id, name, color) {
    fetch("http://localhost:3001/Staff/" + id, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, color: color }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        setStaffUpdates((prevStaffUpdates) => prevStaffUpdates + 1);
        console.log("staffUpdates++");
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function deleteStaff(id) {
    fetch("http://localhost:3001/Staff-" + id, {
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
        setStaffUpdates((prevStaffUpdates) => prevStaffUpdates + 1);
        console.log("staffUpdates++");
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      });
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

  function updateStaffName(id, name) {
    updateInputDialog({
      open: true,
      name: id,
      type: "text",
      text: "Set new name for " + name + ":",
      callback: callbackUpdateStaffName,
    });
  }

  function updateStaffColor(id, name) {
    updateInputDialog({
      open: true,
      name: id,
      type: "text",
      text: "Set new color for " + name + ":",
      callback: callbackUpdateStaffColor,
    });
  }

  function callbackUpdateStaffName(id, newName) {
    var color = EmployeeData.find((e) => e._id === id)?.color;
    updateStaff(id, newName, color);
  }

  function callbackUpdateStaffColor(id, newColor) {
    var name = EmployeeData.find((e) => e._id === id)?.name;
    updateStaff(id, name, newColor);
  }

  function addStaffMember(v, name) {
    fetch("http://localhost:3001/Staff", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, color: "skyblue" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        setStaffUpdates((prevStaffUpdates) => prevStaffUpdates + 1);
        console.log("staffUpdates++");
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  return (
    configMenu === "Staff" && (
      <div id="items">
        <div style={{ textAlign: "center" }}>
          <InputDialog options={inputDialog} setExpanded={setExpanded} />
        </div>
        <div className={"item " + darkmode} onClick={() => addStaff()}>
          <div className="item-content add-new">+</div>
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
                  onClick={() => updateStaffName(_id, name)}
                >
                  Change Name
                </div>
                <div
                  className={"config-btn " + darkmode}
                  onClick={() => updateStaffColor(_id, name)}
                >
                  Change Color
                </div>
                <div
                  className={"config-btn " + darkmode}
                  onClick={() =>
                    window.confirm("Are you sure?") && deleteStaff(_id)
                  }
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
