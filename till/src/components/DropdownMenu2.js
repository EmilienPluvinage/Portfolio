import "../styles/dropdownMenu2.css";
import React, { useState } from "react";

export default function DropdownMenu2({
  options,
  callback,
  name,
  quantity,
  text,
}) {
  const [expanded, setExpanded] = useState(false);
  function expand() {
    setExpanded(true);
  }

  function close() {
    setExpanded(false);
  }

  function select(event) {
    const value = event.target.textContent;
    callback(value, name, quantity);
    close();
  }

  return (
    <div className="dropdown" tabIndex={0} onFocus={expand} onBlur={close}>
      <div className="action">{text}</div>
      {expanded ? (
        <div className={"dropdown-content"}>
          {options.map((O) => (
            <span onClick={select} key={O}>
              {O}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
