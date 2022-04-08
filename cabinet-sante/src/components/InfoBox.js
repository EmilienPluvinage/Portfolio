import "../styles/styles.css";
import React from "react";

function InfoBox({ text, open, setOpen, setDisable }) {
  function close() {
    setOpen(false);
    setDisable(false);
  }

  return (
    open && (
      <div className="dialog" onClick={close}>
        <div className="dialog-content">
          <div>{text}</div>
        </div>
      </div>
    )
  );
}

export default InfoBox;
