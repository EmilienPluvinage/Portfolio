import "../styles/item.css";
import "../styles/config.css";
import { useState } from "react";
import NewItemDialog from "./newItemDialog";
import { displayPrice } from "./Functions";

function ItemConfig({
  configMenu,
  updateConfigMenu,
  darkmode,
  EmployeeData,
  ItemUpdates,
  setItemUpdates,
  ItemData,
}) {
  const [itemDialog, updateItemDialog] = useState({
    open: false,
    id: 0,
    defaultValues: {},
    callback: null,
  });

  function setExpandedNewItem(bool) {
    updateItemDialog({
      open: bool,
      id: itemDialog.id,
      defaultValues: itemDialog.defaultValues,
      callback: itemDialog.callback,
    });
  }

  function addItem() {
    updateItemDialog({
      open: true,
      id: 0,
      defaultValues: {},
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
        setItemUpdates(ItemUpdates + 1);
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function deleteItem(id) {
    fetch("http://localhost:3001/Item-" + id, {
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
        setItemUpdates(ItemUpdates + 1);
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function updateItem(id, name) {
    var defaultValues = ItemData.find((e) => e._id === id);
    updateItemDialog({
      open: true,
      id: id,
      defaultValues: defaultValues,
      callback: callbackUpdateItem,
    });
  }

  function callbackUpdateItem(value, id) {
    console.log(value);
  }

  return (
    configMenu === "Items" && (
      <div id="items">
        <div style={{ textAlign: "center" }}>
          <NewItemDialog
            options={itemDialog}
            setExpanded={setExpandedNewItem}
          />
        </div>
        <div className={"item " + darkmode} onClick={() => addItem()}>
          <div className="item-content add-new">+</div>
        </div>
        {ItemData.map(({ name, category, price, _id }) => (
          <div key={_id} className={"config-item " + darkmode}>
            <div className="config-item-content">
              {category} <br />
              {name}
              <div className="price">{displayPrice(price)} €</div>
              <div className="config-buttons">
                <div
                  className={"config-btn " + darkmode}
                  onClick={() => updateItem(_id, name)}
                >
                  Update
                </div>

                <div
                  className={"config-btn " + darkmode}
                  onClick={() =>
                    window.confirm("Are you sure?") && deleteItem(_id)
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

export default ItemConfig;
