import "../styles/item.css";
import "../styles/config.css";
import { useState } from "react";
import NewItemDialog from "./newItemDialog";

function ItemConfig({
  configMenu,
  updateConfigMenu,
  darkmode,
  EmployeeData,
  ItemUpdates,
  setItemUpdates,
}) {
  const [itemDialog, updateItemDialog] = useState({
    open: false,
    id: 0,
    callback: null,
  });

  function setExpanded(bool) {
    updateItemDialog({
      open: bool,
      id: itemDialog.id,
      callback: itemDialog.callback,
    });
  }
  function addItem() {
    updateItemDialog({
      open: true,
      id: 0,
      callback: newItem,
    });
  }

  function newItem(item) {
    item.vatIn *= 1000;
    item.vatOut *= 1000;
    fetch("http://localhost:3001/Item", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
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
    setItemUpdates(ItemUpdates + 1);
  }

  return (
    configMenu === "Items" && (
      <div id="items">
        <div style={{ textAlign: "center" }}>
          <NewItemDialog options={itemDialog} setExpanded={setExpanded} />
        </div>
        <div className={"item " + darkmode} onClick={() => addItem()}>
          <div className="item-content">+ Add</div>
        </div>
      </div>
    )
  );
}

export default ItemConfig;
