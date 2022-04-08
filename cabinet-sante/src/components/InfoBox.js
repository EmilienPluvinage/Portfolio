import "../styles/styles.css";
import React from "react";

function InfoBox({ text, open, setOpen }) {
  function close() {
    setOpen(false);
  }

  return (
    open && (
      <div className="dialog" onClick={close}>
        <div className="dialog-content">
          <div style={{ margin: "auto" }}>{text}</div>
        </div>
      </div>
    )
  );
}

export default InfoBox;
