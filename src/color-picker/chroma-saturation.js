import React, { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import { styled } from "styletron-react";
import {
  COLORS_PICKER_BACKGROUND,
  CHROMA_SATURATION_PICKER_RADIUS,
  CHROMA_SATURATION_CIRCLE_OFFSET,
} from "./consts";
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
  width: `calc(100% - ${CHROMA_SATURATION_CIRCLE_OFFSET}px)`,
  height: `calc(100% - ${CHROMA_SATURATION_CIRCLE_OFFSET}px)`,
  top: "50%",
  left: "50%",
  boxSizing: "border-box",
  transform: "translate(-50%, -50%) rotate(-90deg)",
  cursor: "pointer",
  borderRadius: "100%",
  background: COLORS_PICKER_BACKGROUND,
});

const ChromaSaturationPicker = styled("div", ({ $x, $y }) => ({
  width: `${CHROMA_SATURATION_PICKER_RADIUS * 2}px`,
  height: `${CHROMA_SATURATION_PICKER_RADIUS * 2}px`,
  margin: `-${CHROMA_SATURATION_PICKER_RADIUS}px`,
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
  const diameter = 276 - CHROMA_SATURATION_CIRCLE_OFFSET; // TODO: calculate this elsehwere
  const radius = diameter / 2;

  const movePicker = useCallback(
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

  const handleMouseDown = useCallback((evt) => onMouseDown(evt, movePicker), [
    movePicker,
    onMouseDown,
  ]);

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
      <ChromaSaturationCircle onMouseDown={handleMouseDown} />
      <ChromaSaturationPicker
        $x={pickerCoords.x}
        $y={pickerCoords.y}
        onMouseDown={handleMouseDown}
      />
    </ChromaSaturationCircleContainer>
  );
};

export default ChromaSaturation;
