import "../../styles/item.css";
import "../../styles/config.css";
import { useState } from "react";
import InputDialog from "../InputDialog";
import { useTheme } from "../ThemeContext";

function CategoryConfig({
  configMenu,
  ItemData,
  itemUpdates,
  setItemUpdates,
  demoMode,
}) {
  const darkmode = useTheme();

  const categories = ItemData.reduce(
    (acc, item) =>
      acc.includes(item.category) ? acc : acc.concat(item.category),
    []
  );

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

  function updateCategoryName(e) {
    updateInputDialog({
      open: true,
      name: e,
      defaultValue: e,
      type: "text",
      text: "Update the name of category " + e + ".",
      callback: callbackUpdate,
    });
  }

  function callbackUpdate(e, name) {
    fetch(
      process.env.REACT_APP_API_DOMAIN +
        "/Category/Update/" +
        process.env.REACT_APP_API_KEY,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldCategory: e, newCategory: name }),
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

  return (
    configMenu === "Categories" && (
      <div id="items">
        <div style={{ textAlign: "center" }}>
          <InputDialog options={inputDialog} setExpanded={setExpanded} />
        </div>
        {categories.map((e) => (
          <div key={e} className={"config-item " + darkmode}>
            <div className="config-item-content">
              {e}
              <div className="config-buttons">
                <div
                  className={"config-btn " + darkmode}
                  onClick={() =>
                    demoMode
                      ? alert("Disabled in demonstration mode.")
                      : updateCategoryName(e)
                  }
                >
                  Update
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  );
}

export default CategoryConfig;
