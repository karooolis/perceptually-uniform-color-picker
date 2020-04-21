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
          // The atan2 method returns a numeric value between -pi and pi representing the angle theta of an (x,y) point.
          // This is the counterclockwise angle, measured in radians, between the positive X axis, and the point (x,y).
          // Note that the arguments to this function pass the y-coordinate first and the x-coordinate second.
          // atan2 is passed separate x and y arguments, and atan is passed the ratio of those two arguments.
          // * from Mozilla's MDN

          // Basically you give it an [y, x] difference of two points and it give you back an angle
          // The 0 point of the angle is left (the initial position of the picker is also left)

          angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

        // Math.atan2(deltaY, deltaX) => [-PI +PI]
        // We must convert it to deg so...
        // / Math.PI => [-1 +1]
        // * 180 => [-180 +180]

        return angle;
      },
      // DRAGSTART
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
      rotate = function (x, y) {
        var deltaX = x - center.x,
          deltaY = y - center.y,
          // The atan2 method returns a numeric value between -pi and pi representing the angle theta of an (x,y) point.
          // This is the counterclockwise angle, measured in radians, between the positive X axis, and the point (x,y).
          // Note that the arguments to this function pass the y-coordinate first and the x-coordinate second.
          // atan2 is passed separate x and y arguments, and atan is passed the ratio of those two arguments.
          // * from Mozilla's MDN

          // Basically you give it an [y, x] difference of two points and it give you back an angle
          // The 0 point of the angle is left (the initial position of the picker is also left)

          angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

        // Math.atan2(deltaY, deltaX) => [-PI +PI]
        // We must convert it to deg so...
        // / Math.PI => [-1 +1]
        // * 180 => [-180 +180]

        return angle;
      },
      // DRAGSTART
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
      mousemove = function (e) {
        const circleWidth = 244;
        const circleHeight = 244;
        const radius = circleWidth / 2;

        const { left: circleLeft, top: circleTop } = getOffset(pickerCircle);
        const { left: containerLeft, top: containerTop } = getOffset(circle);
        const left = Math.abs(containerLeft - e.pageX);
        const top = Math.abs(containerTop - e.pageY);

        // let isInside = ((left - center.x) ^ 2 + (top - center.y)) < Math.pow(radius, 2);

        // const dx = Math.abs(circleLeft - center.x + 15) // 15 is radius of picker circle
        // const dy = Math.abs(circleTop - center.y + 15)

        // console.log('circle yo', circleTop, e.pageY, e.offsetY, e.clientY)

        const dx = Math.abs(e.pageX - center.x); // 15 is radius of picker circle
        const dy = Math.abs(e.pageY - center.y);
        const R = radius;

        function isInside() {
          if (dx + dy <= R) {
            return true;
          }

          if (dx > R) {
            return false;
          }

          if (dy > R) {
            return false;
          }

          if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(R, 2)) {
            return true;
          }

          return false;
        }

        // const deltaX = e.pageX - center.x;
        // const deltaY = e.pageY - center.y;
        // const angle = Math.atan(deltaY, deltaX);
        // // const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
        // console.log('angle', angle)

        if (isInside()) {
          pickerCircle.style[transform] = `translate(${left}px, ${top}px)`;
        } else {
          const deltaX = e.pageX - center.x;
          const deltaY = e.pageY - center.y;
          let radians = Math.atan2(deltaY, deltaX);
          if (radians < 0) {
            radians += 2 * Math.PI;
          }

          const x2 = radius + radius * Math.cos(radians);
          const y2 = radius + radius * Math.sin(radians);

          // console.log(angle, x2, y2)

          pickerCircle.style[transform] = `translate(${x2}px, ${y2}px)`;
        }

        // console.log('isInside', isInside())

        // console.log("rotate", isInside(), angle, left, top);

        // console.log(e.pageX, e.pageY);
        // console.log(circleTop, containerTop);

        // const translateStr = pickerCircle.style[transform];

        // console.log(left, top, translateStr)

        // console.log(currentTarget)

        // const translateStr = pickerCircle.style[transform];
        // const translate = translateStr
        //   .substring(translateStr.indexOf("(") + 1, translateStr.indexOf(")"))
        //   .split(",");

        // const { x, y } = pickerCircle.getBoundingClientRect();

        // console.log(x, pageX, y, pageY);

        // const left = Math.abs(x - pageX);
        // const top = Math.abs(y - pageY);

        // console.log(translateStr, left, top, translate)
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
