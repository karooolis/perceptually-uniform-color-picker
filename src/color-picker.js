import React, { useEffect, useRef, useState, useCallback } from "react";

const ColorPicker = () => {
  const circle = useRef();
  const dragging = useRef(false);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [angle, setAngle] = useState(90);
  const [color, setColor] = useState([50, 50, 50]);

  const calcAngle = useCallback((x, y) => {
    return (Math.atan2(y, x) * 180) / Math.PI;
  }, []);

  const calcLightness = useCallback(
    (x, y) => {
      // TODO: try to simplify calculations
      return ((calcAngle(Math.abs(x), y) + 90) / 180) * 100;
    },
    [calcAngle]
  );

  const onMouseMove = useCallback(
    ({ pageX, pageY }) => {
      if (!dragging.current) {
        return;
      }

      const deltaX = pageX - center.x;
      const deltaY = pageY - center.y;
      const angle = calcAngle(deltaX, deltaY);
      const lightness = calcLightness(deltaX, deltaY);

      setColor([color[0], color[1], lightness]);
      setAngle(angle);
    },
    [calcAngle, calcLightness, center.x, center.y, color]
  );

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = null;
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  const onMouseDown = useCallback(
    (evt) => {
      evt.preventDefault();
      dragging.current = true;
      document.body.style.cursor = "move";
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
      onMouseMove(evt);
    },
    [onMouseMove, onMouseUp]
  );

  useEffect(() => {
    const rect = circle.current.getBoundingClientRect();
    setCenter({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }, []);

  return (
    <>
      <div
        style={{
          width: 100,
          height: 100,
          background: `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`,
        }}
      />

      <div
        id="circle"
        ref={circle}
        className="PickerContainerTop"
        style={{
          background: `linear-gradient(rgb(0, 0, 0), hsl(${color[0]}, ${color[1]}%, 50%), hsl(${color[0]}, ${color[1]}%, 95%))`,
        }}
      >
        <div id="picker" style={{ transform: `rotate(${angle}deg)` }}>
          <div id="picker-circle" onMouseDown={onMouseDown}></div>
        </div>
      </div>
    </>
  );
};

export default ColorPicker;
