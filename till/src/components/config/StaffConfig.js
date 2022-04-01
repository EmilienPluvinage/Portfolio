import "../../styles/item.css";
import "../../styles/config.css";
import { useState } from "react";
import InputDialog from "../InputDialog";
import ColorPicker from "../ColorPicker";
import { useEffect } from "react";

function StaffConfig({
  configMenu,
  darkmode,
  EmployeeData,
  staffUpdates,
  setStaffUpdates,
  demoMode,
}) {
  const [inputDialog, updateInputDialog] = useState({
    open: false,
    name: "",
    defaultValue: "",
    type: "text",
    text: "",
    callback: null,
  });

  const [showColorPicker, setShowColorPicker] = useState([]);

  useEffect(() => {
    // inits showColorPicker to false for everyone
    var temp = EmployeeData.map((e) => ({ id: e._id, show: false }));
    setShowColorPicker(temp);
  }, [EmployeeData]);

  function CloseColorPicker() {
    var temp = showColorPicker.map((e) => {
      return { id: e.id, show: false };
    });
    setShowColorPicker(temp);
  }

  function OpenColorPicker(id) {
    var temp = showColorPicker.map((e) => {
      return { id: e.id, show: false };
    });
    var index = temp.findIndex((e) => e.id === id);
    temp[index].show = true;
    setShowColorPicker(temp);
  }

  function setExpanded(bool) {
    updateInputDialog({
      open: bool,
      name: inputDialog.name,
      defaultValue: inputDialog.defaultValue,
      type: inputDialog.type,
      text: inputDialog.text,
      callback: inputDialog.callback,
    });
  }

  function updateStaff(id, name, color) {
    fetch(
      process.env.REACT_APP_API_DOMAIN +
        "/Staff/" +
        id +
        "/" +
        process.env.REACT_APP_API_KEY,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, color: color }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        setStaffUpdates((prevStaffUpdates) => prevStaffUpdates + 1);
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function deleteStaff(id) {
    fetch(
      process.env.REACT_APP_API_DOMAIN +
        "/Staff-" +
        id +
        "/" +
        process.env.REACT_APP_API_KEY,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        setStaffUpdates((prevStaffUpdates) => prevStaffUpdates + 1);
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
      defaultValue: name,
      type: "text",
      text: "Set new name for " + name + ":",
      callback: callbackUpdateStaffName,
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
    fetch(
      process.env.REACT_APP_API_DOMAIN +
        "/Staff/" +
        process.env.REACT_APP_API_KEY,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, color: "skyblue" }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        setStaffUpdates((prevStaffUpdates) => prevStaffUpdates + 1);
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
        <div
          className={"item " + darkmode}
          onClick={() =>
            demoMode ? alert("Disabled in demonstration mode.") : addStaff()
          }
        >
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
                  onClick={() =>
                    showColorPicker.find((e) => e.id === _id)?.show
                      ? CloseColorPicker()
                      : OpenColorPicker(_id)
                  }
                >
                  Change Color
                </div>
                {showColorPicker.find((e) => e.id === _id)?.show ? (
                  <div>
                    <ColorPicker
                      initColor={color}
                      callback={callbackUpdateStaffColor}
                      id={_id}
                    />
                  </div>
                ) : null}
                <div
                  className={"config-btn " + darkmode}
                  onClick={() =>
                    demoMode
                      ? alert("Disabled in demonstration mode.")
                      : window.confirm("Are you sure?") && deleteStaff(_id)
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
