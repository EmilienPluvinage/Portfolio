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
    updateInputDialog({
      open: true,
      name: id,
      defaultValue: value,
      type: type === "Phone" ? "text" : "textarea",
      text: "Set new name for " + type + ":",
      callback: type === "Phone" ? callbackPhone : callbackAddress,
    });
  }

  function updateContacts(id, phone, address) {
    fetch("http://localhost:3001/Contact/" + id, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address: address, phone: phone }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        setContactDataUpdates((prev) => prev + 1);
        console.log("ContactDataUpdates++");
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function callbackPhone(id, value) {
    var address = ContactData.find((e) => e._id === id).address;
    updateContacts(id, value, address);
  }

  function callbackAddress(id, value) {
    var phone = ContactData.find((e) => e._id === id).phone;
    updateContacts(id, phone, value);
  }

  return (
    configMenu === "Contact" && (
      <div id="items">
        <div style={{ textAlign: "center" }}>
          <InputDialog options={inputDialog} setExpanded={setExpanded} />
        </div>

        {ContactData.map(({ _id, address, phone }) => (
          <div
            key={_id}
            className={"config-item " + darkmode}
            style={{ width: "fit-content" }}
          >
            <div className="config-item-content">
              <div style={{ whiteSpace: "pre-line" }}>{address}</div>
              {phone}
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
