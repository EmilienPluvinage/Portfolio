import "../styles/inputDialog.css";
import React, { useState, useEffect } from "react";

function NewItemDialog(props) {
  const [value, setValue] = useState({
    name: "",
    category: "",
    price: "",
    vatIn: "",
    vatOut: "",
  });

  const categories = props.ItemData.reduce(
    (acc, item) =>
      acc.includes(item.category) ? acc : acc.concat(item.category),
    []
  );

  useEffect(() => {
    // we prefill the fields if it's an update, leave them empty if it's an addition
    if (props?.options?.id === 0) {
      setValue({
        name: "",
        category: "",
        price: "",
        vatIn: "",
        vatOut: "",
      });
    } else {
      var propsValue = props?.options?.defaultValues;
      setValue({
        name: propsValue?.name,
        category: propsValue?.category,
        price: propsValue?.price / 100,
        vatIn: propsValue?.vatIn / 1000,
        vatOut: propsValue?.vatOut / 1000,
      });
    }
  }, [props?.options]);

  function close() {
    props.setExpanded(false);
  }

  function handleChange(event, name) {
    switch (name) {
      case "name":
        setValue({
          name: event.target.value,
          category: value.category,
          price: value.price,
          vatIn: value.vatIn,
          vatOut: value.vatOut,
        });
        break;
      case "category":
        setValue({
          name: value.name,
          category: event.target.value,
          price: value.price,
          vatIn: value.vatIn,
          vatOut: value.vatOut,
        });
        break;
      case "price":
        setValue({
          name: value.name,
          category: value.category,
          price: event.target.value,
          vatIn: value.vatIn,
          vatOut: value.vatOut,
        });
        break;
      case "vatIn":
        setValue({
          name: value.name,
          category: value.category,
          price: value.price,
          vatIn: event.target.value,
          vatOut: value.vatOut,
        });
        break;
      case "vatOut":
        setValue({
          name: value.name,
          category: value.category,
          price: value.price,
          vatIn: value.vatIn,
          vatOut: event.target.value,
        });
        break;
      default:
    }
  }

  function handleSubmit(event) {
    close();
    props.options.callback(value, props.options.id);
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
                value={value.name}
                required
              />
            </p>
          </label>
          <label htmlFor="category-select">
            <p>Choose a category:</p>
          </label>

          <p>
            <select
              name="category"
              id="category-select"
              value={value.category}
              onChange={(e) => handleChange(e, "category")}
              required
            >
              <option value="">Please choose an option</option>

              {categories.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </p>

          <label>
            <p>Item Price (in euros) :</p>
            <p>
              <input
                className="input"
                type="number"
                placeholder="0"
                step="0.01"
                min="0"
                onChange={(e) => handleChange(e, "price")}
                value={value.price}
                required
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
                min="0"
                max="1"
                step="0.001"
                onChange={(e) => handleChange(e, "vatIn")}
                value={value.vatIn}
                required
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
                min="0"
                max="1"
                step="0.001"
                onChange={(e) => handleChange(e, "vatOut")}
                value={value.vatOut}
                required
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
