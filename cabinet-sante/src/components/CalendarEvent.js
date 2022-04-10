import "../styles/CalendarEvent.css";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

export const useContainerDimensions = (myRef) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const getDimensions = () => ({
      width: myRef.current.offsetWidth,
      height: myRef.current.offsetHeight,
    });

    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (myRef.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [myRef]);

  return dimensions;
};

export default function CalendarEvent({ text }) {
  const componentRef = useRef();
  const { width, height } = useContainerDimensions(componentRef);
  return (
    <div className={"event-content"} ref={componentRef}>
      <div>
        width: {width}px, height: {height}px
      </div>
    </div>
  );
}
