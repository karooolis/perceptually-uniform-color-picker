import React, { useEffect, useRef, useCallback } from "react";
import _ from "lodash";
import { styled } from "styletron-react";
import Lightness from "./lightness";
import ChromaSaturation from "./chroma-saturation";
import { usePrevious } from "../hooks"

const ColorPickerContainer = styled("div", ({ $color }) => ({
  position: "relative",
  width: "300px",
  height: "300px",
  cursor: "pointer",
}));

const ColorPicker = ({ color, colorIdx, setColor }) => {
  const circle = useRef();
  const mouseMoveCb = useRef();
  const dragging = useRef(false);
  const center = useRef({ x: 0, y: 0 });
  const prevColorIdx = usePrevious(colorIdx)

  const onMouseMove = useCallback((evt) => {
    if (!dragging.current) {
      return;
    }

    if (typeof mouseMoveCb.current === "function") {
      mouseMoveCb.current(evt);
    }
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    mouseMoveCb.current = null;

    document.body.style.cursor = null;
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  const onMouseDown = useCallback(
    (evt, cb) => {
      evt.preventDefault();
      dragging.current = true;
      mouseMoveCb.current = cb;

      document.body.style.cursor = "move";
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
      onMouseMove(evt);
    },
    [onMouseMove, onMouseUp]
  );

  useEffect(() => {
    const rect = circle.current.getBoundingClientRect();
    center.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }, [circle]);

  return (
    <ColorPickerContainer ref={circle}>
      <Lightness
        circle={circle}
        center={center}
        color={color}
        colorIdx={colorIdx}
        prevColorIdx={prevColorIdx}
        setColor={setColor}
        onMouseDown={onMouseDown}
      />

      <ChromaSaturation
        circle={circle}
        center={center}
        color={color}
        colorIdx={colorIdx}
        prevColorIdx={prevColorIdx}
        setColor={setColor}
        onMouseDown={onMouseDown}
      />
    </ColorPickerContainer>
  );
};

export default ColorPicker;
