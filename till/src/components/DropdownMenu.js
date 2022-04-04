import "../styles/dropdownMenu.css";
import React, { useState } from "react";
import { useTheme } from "./ThemeContext";

export default function DropdownMenu({
  options,
  callback,
  name,
  quantity,
  text,
}) {
  const darkmode = useTheme();

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
        <div className={"dropdown-content " + darkmode}>
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
