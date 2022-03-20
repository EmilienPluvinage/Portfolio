import "../styles/item.css";
import "../styles/config.css";
import { useState } from "react";
import InputDialog from "./InputDialog";

function StaffConfig({ configMenu, updateConfigMenu, darkmode, EmployeeData }) {
  const [inputDialog, updateInputDialog] = useState({
    open: false,
    name: "",
    text: "",
    callback: null,
  });

  function setExpanded(bool) {
    updateInputDialog({
      open: bool,
      name: inputDialog.name,
      text: inputDialog.text,
      callback: inputDialog.callback,
    });
  }

  return (
    configMenu === "Staff" && (
      <div id="items">
        <div style={{ textAlign: "center" }}>
          <InputDialog options={inputDialog} setExpanded={setExpanded} />
        </div>
        {EmployeeData.map(({ _id, name, color }) => (
          <div key={_id} className={"config-item " + darkmode}>
            <div className="config-item-content">
              {name}
              <div className="config-buttons">
                <div className={"config-btn " + darkmode}>Modify</div>
                <div className={"config-btn " + darkmode}>Delete</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  );
}

export default StaffConfig;
