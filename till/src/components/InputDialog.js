import "../styles/inputDialog.css";
import React, { useState } from "react";

function InputDialog(props) {
  const [value, setValue] = useState("");
  function close() {
    props.setExpanded(false);
  }

  function handleChange(event) {
    setValue(event.target.value);
  }
  function handleSubmit(event) {
    close();
    props.callback(value, props.name);
    event.preventDefault();
  }

  return props.expanded ? (
    <div className="dialog">
      <div className="dialog-content">
        <form onSubmit={handleSubmit}>
          <label>
            <p>Please enter a number:</p>
            <p>
              <input
                id="number"
                className="input"
                type={"number"}
                placeholder={"1"}
                onChange={handleChange}
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
