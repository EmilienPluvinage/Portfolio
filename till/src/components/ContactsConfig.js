import "../styles/item.css";
import "../styles/config.css";
import { useState } from "react";
import InputDialog from "./InputDialog";

function ContactsConfig({
  configMenu,
  darkmode,
  ContactData,
  contactDataUpdates,
  setContactDataUpdates,
}) {
  const [inputDialog, updateInputDialog] = useState({
    open: false,
    name: "",
    defaultValue: "",
    type: "text",
    text: "",
    callback: null,
  });

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
  function update(id, value, type) {
    console.log(type + ": " + value);
  }
  return (
    configMenu === "Contact" && (
      <div id="items">
        <div style={{ textAlign: "center" }}>
          <InputDialog options={inputDialog} setExpanded={setExpanded} />
        </div>

        {ContactData.map(({ _id, address, phone }) => (
          <div key={_id} className={"config-item " + darkmode}>
            <div className="config-item-content">
              {address} <br /> {phone}
              <div className="config-buttons">
                <div
                  className={"config-btn " + darkmode}
                  onClick={() => update(_id, address, "Address")}
                >
                  Change Address
                </div>
                <div
                  className={"config-btn " + darkmode}
                  onClick={() => update(_id, phone, "Phone")}
                >
                  Change Phone Number
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  );
}

export default ContactsConfig;
