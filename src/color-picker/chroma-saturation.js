import React, { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import { styled } from "styletron-react";
import {
  calcAngleRadians,
  calcHue,
  calcSaturation,
  calcPickerCoords,
  calcPickerCoordsFromColor,
} from "./utils";

const ChromaSaturationCircleContainer = styled("div", {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "calc(100% - 24px)",
  height: "calc(100% - 24px)",
  transform: "translate(-50%, -50%)",
  borderRadius: "100%",
  background: "#fff",
  cursor: "pointer",
});

const ChromaSaturationCircle = styled("div", {
  position: "absolute",
  width: "calc(100%)",
  height: "calc(100%)",
  top: "50%",
  left: "50%",
  boxSizing: "border-box",
  transform: "translate(-50%, -50%) rotate(-90deg)",
  cursor: "pointer",
  borderRadius: "100%",
  background: `radial-gradient(
      circle at 50% 0,
      red,
      rgba(242, 13, 13, 0.8) 10%,
      rgba(230, 26, 26, 0.6) 20%,
      rgba(204, 51, 51, 0.4) 30%,
      rgba(166, 89, 89, 0.2) 40%,
      hsla(0, 0%, 50%, 0) 50%
    ),
    radial-gradient(
      circle at 85.35533905932738% 14.644660940672622%,
      #ffbf00,
      rgba(242, 185, 13, 0.8) 10%,
      rgba(230, 179, 26, 0.6) 20%,
      rgba(204, 166, 51, 0.4) 30%,
      rgba(166, 147, 89, 0.2) 40%,
      hsla(45, 0%, 50%, 0) 50%
    ),
    radial-gradient(
      circle at 100% 50%,
      #80ff00,
      rgba(128, 242, 13, 0.8) 10%,
      rgba(128, 230, 26, 0.6) 20%,
      rgba(128, 204, 51, 0.4) 30%,
      rgba(128, 166, 89, 0.2) 40%,
      hsla(90, 0%, 50%, 0) 50%
    ),
    radial-gradient(
      circle at 85.35533905932738% 85.35533905932738%,
      #00ff40,
      rgba(13, 242, 70, 0.8) 10%,
      rgba(26, 230, 77, 0.6) 20%,
      rgba(51, 204, 89, 0.4) 30%,
      rgba(89, 166, 108, 0.2) 40%,
      hsla(135, 0%, 50%, 0) 50%
    ),
    radial-gradient(
      circle at 50.00000000000001% 100%,
      #0ff,
      rgba(13, 242, 242, 0.8) 10%,
      rgba(26, 230, 230, 0.6) 20%,
      rgba(51, 204, 204, 0.4) 30%,
      rgba(89, 166, 166, 0.2) 40%,
      hsla(180, 0%, 50%, 0) 50%
    ),
    radial-gradient(
      circle at 14.64466094067263% 85.35533905932738%,
      #0040ff,
      rgba(13, 70, 242, 0.8) 10%,
      rgba(26, 77, 230, 0.6) 20%,
      rgba(51, 89, 204, 0.4) 30%,
      rgba(89, 108, 166, 0.2) 40%,
      hsla(225, 0%, 50%, 0) 50%
    ),
    radial-gradient(
      circle at 0 50.00000000000001%,
      #7f00ff,
      rgba(128, 13, 242, 0.8) 10%,
      rgba(128, 26, 230, 0.6) 20%,
      rgba(128, 51, 204, 0.4) 30%,
      rgba(128, 89, 166, 0.2) 40%,
      hsla(270, 0%, 50%, 0) 50%
    ),
    radial-gradient(
      circle at 14.644660940672615% 14.64466094067263%,
      #ff00bf,
      rgba(242, 13, 185, 0.8) 10%,
      rgba(230, 26, 179, 0.6) 20%,
      rgba(204, 51, 166, 0.4) 30%,
      rgba(166, 89, 147, 0.2) 40%,
      hsla(315, 0%, 50%, 0) 50%
    )`,
});

const ChromaSaturationPicker = styled("div", ({ $x, $y }) => ({
  width: "30px",
  height: "30px",
  margin: "-15px",
  border: "5px solid #fff",
  borderRadius: "50%",
  boxShadow: "0 2px 12px rgba(14, 19, 24, 0.15)",
  transform: `translate(${$x}px, ${$y}px)`,
  boxSizing: "border-box",
  willChange: "width, height",
  userSelect: "none",
  zIndex: 1,
}));

const ChromaSaturation = ({
  circle,
  center,
  color,
  prevColorIdx,
  colorIdx,
  setColor,
  onMouseDown,
}) => {
  const [pickerCoords, setPickerCoords] = useState({ x: 50, y: 50 });
  const diameter = 276; // TODO: calculate this elsehwere
  const radius = diameter / 2;

  const handleMouseMove = useCallback(
    ({ pageX, pageY }) => {
      const dx = pageX - center.current.x;
      const dy = center.current.y - pageY;

      // TODO: move all these chrome/saturation specific calculations into its own calculation class, same for lightness
      const angle = calcAngleRadians(dy, dx);
      const hue = calcHue(angle);
      const saturation = calcSaturation(radius, dx, dy);
      const { x, y } = calcPickerCoords(
        pageX,
        pageY,
        circle,
        dx,
        dy,
        radius,
        angle
      );

      setColor([hue, saturation, color[2]]);
      setPickerCoords({ x, y });
    },
    [center, circle, color, radius, setColor]
  );

  const handleMouseDown = useCallback(
    (evt) => onMouseDown(evt, handleMouseMove),
    [handleMouseMove, onMouseDown]
  );

  // TODO: might be better to refactor by setting up callback handlers in parent
  useEffect(() => {
    if (_.isEqual(colorIdx, prevColorIdx)) {
      return;
    }

    const newCoords = calcPickerCoordsFromColor(radius, color);
    setPickerCoords(newCoords);
  }, [color, colorIdx, prevColorIdx, radius]);

  return (
    <ChromaSaturationCircleContainer>
      <ChromaSaturationCircle />
      <ChromaSaturationPicker
        $x={pickerCoords.x}
        $y={pickerCoords.y}
        onMouseDown={handleMouseDown}
      />
    </ChromaSaturationCircleContainer>
  );
};

export default ChromaSaturation;
