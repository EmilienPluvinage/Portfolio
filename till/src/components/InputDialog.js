import "../styles/inputDialog.css";
import React, { useState, useEffect } from "react";

function InputDialog(props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    // we prefill the fields if it's an update, leave them empty if it's an addition
    if (props?.options?.defaultValue === undefined) {
      setValue("");
    } else {
      var propsValue = props?.options?.defaultValue;
      setValue(propsValue);
    }
  }, [props?.options]);

  function close() {
    props.setExpanded(false);
  }

  function handleChange(event) {
    setValue(event.target.value);
  }
  function handleSubmit(event) {
    close();
    props.options.callback(props.options.name, value);
    event.preventDefault();
  }

  return props.options.open ? (
    <div className="dialog">
      <div className="dialog-content">
        <form onSubmit={handleSubmit}>
          <label>
            <p>{props.options.text}</p>
            <p>
              <input
                id="number"
                className="input"
                type={props.options.type}
                placeholder={props.options.type === "number" ? "0" : "text"}
                onChange={handleChange}
                value={value}
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

export default InputDialog;
