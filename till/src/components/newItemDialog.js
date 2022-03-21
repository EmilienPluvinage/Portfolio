import "../styles/inputDialog.css";
import React, { useState } from "react";

function NewItemDialog(props) {
  const [value, setValue] = useState({
    name: "",
    category: "",
    price: 0,
    vatIn: 0,
    vatOut: 0,
  });

  function close() {
    props.setExpanded(false);
  }

  function handleChange(event, name) {
    switch (name) {
      case "name":
        value.name = event.target.value;
        break;
      case "category":
        value.category = event.target.value;
        break;
      case "price":
        value.price = event.target.value;
        break;
      case "vatIn":
        value.vatIn = event.target.value;
        break;
      case "vatOut":
        value.vatOut = event.target.value;
        break;
      default:
    }
  }

  function handleSubmit(event) {
    close();
    props.options.callback(value);
    event.preventDefault();
  }

  return props.options.open ? (
    <div className="dialog">
      <div className="dialog-content">
        <form onSubmit={handleSubmit}>
          <label>
            <p>Item Name</p>
            <p>
              <input
                className="input"
                type="text"
                placeholder="name"
                onChange={(e) => handleChange(e, "name")}
              />
            </p>
          </label>
          <label>
            <p>Item Category</p>
            <p>
              <input
                className="input"
                type="text"
                placeholder="category"
                onChange={(e) => handleChange(e, "category")}
              />
            </p>
          </label>
          <label>
            <p>Item Price (in cents) :</p>
            <p>
              <input
                className="input"
                type="number"
                placeholder="0"
                onChange={(e) => handleChange(e, "price")}
              />
            </p>
          </label>
          <label>
            <p>VAT in (decimal between 0 and 1) :</p>
            <p>
              <input
                className="input"
                type="number"
                placeholder="0.1"
                step="0.001"
                onChange={(e) => handleChange(e, "vatIn")}
              />
            </p>
          </label>
          <label>
            <p>VAT out (decimal between 0 and 1) :</p>
            <p>
              <input
                className="input"
                type="number"
                placeholder="0.1"
                step="0.001"
                onChange={(e) => handleChange(e, "vatOut")}
              />
            </p>
          </label>
          <p>
            <input
              className="btn"
              type="button"
              value="Cancel"
              onClick={close}
            />
            &nbsp;
            <input className="btn" type="submit" value="Submit" />
          </p>
        </form>
      </div>
    </div>
  ) : null;
}

export default NewItemDialog;
