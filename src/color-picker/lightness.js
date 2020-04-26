import React, { useEffect, useRef, useState, useCallback } from "react";
import { styled } from "styletron-react";

const LightnessPickerContainer = styled("div", ({ $angle }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  height: "15px",
  width: "50%",
  marginTop: "-7.5px",
  transform: `rotate(${$angle}deg)`,
  transformOrigin: "center left",
}));

const LightnessPicker = styled("div", {
  width: "15px",
  height: "15px",
  margin: "0 0 0 auto",
  borderRadius: "50%",
  background: "#fff",
  cursor: "dragging",
  zIndex: "100",
});

const Lightness = ({ center, color, setColor, onMouseDown }) => {
  const [angle, setAngle] = useState(0);

  const calcAngle = useCallback(
    (x, y) => (Math.atan2(y, x) * 180) / Math.PI,
    []
  );

  const calcLightness = useCallback(
    (x, y) => ((calcAngle(Math.abs(x), y) + 90) / 180) * 100,
    [calcAngle]
  );

  const handleMouseMove = useCallback(
    ({ pageX, pageY }) => {
      const deltaX = pageX - center.current.x;
      const deltaY = pageY - center.current.y;
      const angle = calcAngle(deltaX, deltaY);
      const lightness = calcLightness(deltaX, deltaY);

      setColor([color[0], color[1], lightness]);
      setAngle(angle);
    },
    [calcAngle, calcLightness, center, color, setColor]
  );

  const handleMouseDown = useCallback(
    (evt) => onMouseDown(evt, handleMouseMove),
    [handleMouseMove, onMouseDown]
  );

  return (
    <LightnessPickerContainer $angle={angle}>
      <LightnessPicker onMouseDown={handleMouseDown} />
    </LightnessPickerContainer>
  );
};

export default Lightness;
