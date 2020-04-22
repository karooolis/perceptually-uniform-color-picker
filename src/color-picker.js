import React, { useEffect } from "react";

const ColorPicker = () => {
  useEffect(() => {
    var circle = document.getElementById("circle"),
      picker = document.getElementById("picker"),
      pickerCircle = document.getElementById("picker-circle"),
      rect = circle.getBoundingClientRect(),
      center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      },
      transform = (function () {
        var prefs = ["t", "WebkitT", "MozT", "msT", "OT"],
          style = document.documentElement.style,
          p;
        for (var i = 0, len = prefs.length; i < len; i++) {
          if ((p = prefs[i] + "ransform") in style) return p;
        }
      })(),
      rotate = function (x, y) {
        var deltaX = x - center.x,
          deltaY = y - center.y,
          angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        function calcAngleDegrees(x, y) {
          return Math.atan2(y, x) * 180 / Math.PI;
        }

        // TODO: adjust calculations
        const lightness = (calcAngleDegrees(Math.abs(deltaX), deltaY) + 90) / 180 * 100;

        return angle;
      },
      mousedown = function (event) {
        event.preventDefault();
        document.body.style.cursor = "move";
        mousemove(event);
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
      },
      // DRAG
      mousemove = function (event) {
        picker.style[transform] =
          "rotate(" + rotate(event.pageX, event.pageY) + "deg)";
      },
      // DRAGEND
      mouseup = function () {
        document.body.style.cursor = null;
        document.removeEventListener("mouseup", mouseup);
        document.removeEventListener("mousemove", mousemove);
      };

    // DRAG START
    pickerCircle.addEventListener("mousedown", mousedown);

    // ENABLE STARTING THE DRAG IN THE BLACK CIRCLE
    circle.addEventListener("mousedown", function (event) {
      if (event.target == this) mousedown(event);
    });
  }, []);

  useEffect(() => {
    var circle = document.getElementById("circle-hue-saturation-2"),
      pickerCircle = document.getElementById("picker-circle-2"),
      rect = circle.getBoundingClientRect(),
      center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      },
      transform = (function () {
        var prefs = ["t", "WebkitT", "MozT", "msT", "OT"],
          style = document.documentElement.style,
          p;
        for (var i = 0, len = prefs.length; i < len; i++) {
          if ((p = prefs[i] + "ransform") in style) return p;
        }
      })(),
      mousedown = function (event) {
        event.preventDefault();
        document.body.style.cursor = "move";
        mousemove(event);
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
      },
      getOffset = (el) => {
        const rect = el.getBoundingClientRect();
        return {
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY,
        };
      },
      mousemove = (e) => {
        // TODO: hardcoded values, change later
        const diameter = 244;
        const radius = diameter / 2;

        const { left: circleLeft, top: circleTop } = getOffset(pickerCircle);
        const { left: containerLeft, top: containerTop } = getOffset(circle);
        const left = Math.abs(containerLeft - e.pageX);
        const top = Math.abs(containerTop - e.pageY);

        const dx = Math.abs(e.pageX - center.x);
        const dy = Math.abs(e.pageY - center.y);

        const deltaX = e.pageX - center.x;
        const deltaY = e.pageY - center.y;
        let radians = Math.atan2(deltaY, deltaX);
        if (radians < 0) {
          radians += 2 * Math.PI;
        }

        let newX = left;
        let newY = top;

        function isInside() {
          if (dx + dy <= radius) {
            return true;
          }

          if (dx > radius) {
            return false;
          }

          if (dy > radius) {
            return false;
          }

          if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(radius, 2)) {
            return true;
          }

          return false;
        }

        if (!isInside()) {
          newX = radius + radius * Math.cos(radians);
          newY = radius + radius * Math.sin(radians);
        }

        // TODO: maybe adjust calculations for this part later
        const distanceFromCenter = Math.min(radius, Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)))
        const hue = (radians + 1.5708) * (180 / Math.PI) % 360;
        const saturation = distanceFromCenter * 100 / radius;

        // console.log(hue, saturation)

        pickerCircle.style[transform] = `translate(${newX}px, ${newY}px)`;
      },
      // DRAGEND
      mouseup = function () {
        document.body.style.cursor = null;
        document.removeEventListener("mouseup", mouseup);
        document.removeEventListener("mousemove", mousemove);
      };

    // DRAG START
    pickerCircle.addEventListener("mousedown", mousedown);

    // ENABLE STARTING THE DRAG IN THE BLACK CIRCLE
    circle.addEventListener("mousedown", function (event) {
      if (event.target == this) mousedown(event);
    });
  }, []);

  return (
    <div id="circle" className=" PickerContainerTop">
      <div id="picker">
        <div id="picker-circle"></div>
      </div>

      <div id="circle-hue-saturation" className="PickerContainerMiddle">
        <div
          id="circle-hue-saturation-2"
          className="PickerContainer"
          style={{ position: "relative" }}
        >
          <div
            id="picker-circle-2"
            className="Point"
            style={{ transform: "translate(112px, 112px)" }}
          >
            <div className="PointInner" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
