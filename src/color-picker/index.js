import React, { useEffect, useRef, useState, useCallback } from "react";
import { styled } from "styletron-react";
import Lightness from "./lightness";
import ChromaSaturation from "./chroma-saturation";
import { hslCssStr } from '../utils';

const LightnessCircle = styled("div", ({ $color }) => ({
  position: "relative",
  width: "300px",
  height: "300px",
  borderRadius: "100%",
  background: `linear-gradient(rgb(0, 0, 0), hsl(${$color[0]}, ${$color[1]}%, 50%), hsl(${$color[0]}, ${$color[1]}%, 95%))`,
  willChange: "background",
  cursor: "pointer",
}));

const ColorPicker = ({color, setColor}) => {
  const circle = useRef();
  const mouseMoveCb = useRef();
  const dragging = useRef(false);
  const center = useRef({ x: 0, y: 0 });

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
  }, []);

  return (
    <>
      <div style={{
        width: '100px',
        height: '100px',
        background: hslCssStr(color) // `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`
      }} />

      <LightnessCircle ref={circle} $color={color}>
        <Lightness
          center={center}
          color={color}
          setColor={setColor}
          onMouseDown={onMouseDown}
        />

        <ChromaSaturation
          circle={circle}
          center={center}
          color={color}
          setColor={setColor}
          onMouseDown={onMouseDown}
        />
      </LightnessCircle>
    </>
  );
};

export default ColorPicker;
