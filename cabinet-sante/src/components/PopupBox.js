import "../styles/popupBox.css";
import React from "react";

export default function PopupBox({ children, title, open, setOpen }) {
  function close() {
    setOpen(false);
  }

  return (
    open && (
      <div className="dialog" onClick={(e) => close(e)}>
        <div className="dialog-content">
          <div className="dialog-title">{title}</div>
          <div className="dialog-children">{children}</div>
        </div>
      </div>
    )
  );
}
