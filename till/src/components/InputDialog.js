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
                placeholder={"0"}
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
