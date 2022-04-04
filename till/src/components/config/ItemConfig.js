import "../../styles/item.css";
import "../../styles/config.css";
import { useState } from "react";
import NewItemDialog from "../newItemDialog";
import { displayPrice } from "../Functions";

function ItemConfig({
  configMenu,
  darkmode,
  EmployeeData,
  setItemUpdates,
  ItemData,
  demoMode,
}) {
  const [itemDialog, updateItemDialog] = useState({
    open: false,
    id: 0,
    defaultValues: {},
    callback: null,
  });

  const categories = ItemData.reduce(
    (acc, item) =>
      acc.includes(item.category) ? acc : acc.concat(item.category),
    []
  );

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
      callback: addOrUpdateItem,
    });
  }

  function updateItem(id) {
    var defaultValues = ItemData.find((e) => e._id === id);
    updateItemDialog({
      open: true,
      id: id,
      defaultValues: defaultValues,
      callback: addOrUpdateItem,
    });
  }

  function deleteItem(id) {
    fetch(
      process.env.REACT_APP_API_DOMAIN +
        "/Item-" +
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
        setItemUpdates((prevItemUpdates) => prevItemUpdates + 1);
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function addOrUpdateItem(item, id) {
    item.vatIn *= 1000;
    item.vatOut *= 1000;
    item.price *= 100;
    if (item.category === "0") {
      // then it's a new category
      item.category = item.newCategory;
    }
    // we removed the newCategory before uploading
    delete item.newCategory;
    var method = "";
    var link = "";
    if (id === 0) {
      method = "POST";
      link = process.env.REACT_APP_API_DOMAIN + "/Item";
    } else {
      method = "PUT";
      link = process.env.REACT_APP_API_DOMAIN + "/Item/" + id;
    }
    fetch(link + "/" + process.env.REACT_APP_API_KEY, {
      method: method,
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
        setItemUpdates((prevItemUpdates) => prevItemUpdates + 1);
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  return (
    configMenu === "Items" && (
      <div>
        <div style={{ textAlign: "center" }}>
          <NewItemDialog
            options={itemDialog}
            setExpanded={setExpandedNewItem}
            ItemData={ItemData}
          />
        </div>
        <div className={"item " + darkmode} onClick={() => addItem()}>
          <div className="item-content add-new">+</div>
        </div>
        {categories.map((CurrentCategory) => (
          <div key={CurrentCategory}>
            <div
              className="category-title"
              style={
                darkmode === "dark"
                  ? { color: "white" }
                  : { color: "rgb(50,50,50)" }
              }
            >
              {CurrentCategory}
            </div>
            <div className="items-config">
              {ItemData.map(
                ({ name, category, price, _id }) =>
                  category === CurrentCategory && (
                    <div key={_id} className={"config-item " + darkmode}>
                      <div className="config-item-content">
                        {name}
                        <div className="price">
                          {displayPrice(Math.round(price))} €
                        </div>
                        <div className="config-buttons">
                          <div
                            className={"config-btn " + darkmode}
                            onClick={() => updateItem(_id)}
                          >
                            Update
                          </div>

                          <div
                            className={"config-btn " + darkmode}
                            onClick={() =>
                              demoMode
                                ? alert("Disabled in demonstration mode.")
                                : window.confirm("Are you sure?") &&
                                  deleteItem(_id)
                            }
                          >
                            Delete
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        ))}
      </div>
    )
  );
}

export default ItemConfig;
