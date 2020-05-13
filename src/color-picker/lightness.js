import React, { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import { styled } from "styletron-react";

const LightnessCircle = styled("div", ({ $color }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  borderRadius: "100%",
  background: `linear-gradient(rgb(0, 0, 0), hsl(${$color[0]}, ${$color[1]}%, 50%), hsl(${$color[0]}, ${$color[1]}%, 95%))`,
  willChange: "background",
  cursor: "pointer",
}));

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
  width: "11px",
  height: "11px",
  margin: "0 0 0 auto",
  borderRadius: "50%",
  background: "#fff",
  cursor: "dragging",
  zIndex: "100",
  boxShadow: "0 0 1px 0px rgba(0, 0, 0, 0.75)",
});

const Lightness = ({
  circle,
  center,
  color,
  colorIdx,
  prevColorIdx,
  setColor,
  onMouseDown,
}) => {
  const [angle, setAngle] = useState(0);

  // Calculate picker angle based on mouse position
  const calcAngle = useCallback(
    (x, y) => (Math.atan2(y, x) * 180) / Math.PI,
    []
  );

  const calcLightness = useCallback(
    (x, y) => ((calcAngle(Math.abs(x), y) + 90) / 180) * 100,
    [calcAngle]
  );

  const movePicker = useCallback(
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

  const handleMouseDown = useCallback((evt) => onMouseDown(evt, movePicker), [
    movePicker,
    onMouseDown,
  ]);

  // TODO: might be better to refactor by setting up callback handlers in parent
  useEffect(() => {
    if (_.isEqual(colorIdx, prevColorIdx)) {
      return;
    }

    const lightness = color[2];
    const newAngle = ((lightness / 100) * 2 - 1) * 90;
    setAngle(newAngle);
  }, [angle, color, colorIdx, prevColorIdx]);

  return (
    <LightnessCircle $color={color} onMouseDown={handleMouseDown}>
      <LightnessPickerContainer $angle={angle}>
        <LightnessPicker onMouseDown={handleMouseDown} />
      </LightnessPickerContainer>
    </LightnessCircle>
  );
};

export default Lightness;
