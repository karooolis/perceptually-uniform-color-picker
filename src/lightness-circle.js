import React, { useEffect } from "react";

const LightnessCircle = () => {
  // useEffect(() => {
  //   var circle = document.getElementById("circle"),
  //     picker = document.getElementById("picker"),
  //     pickerCircle = picker.firstElementChild,
  //     rect = circle.getBoundingClientRect(),
  //     center = {
  //       x: rect.left + rect.width / 2,
  //       y: rect.top + rect.height / 2,
  //     },
  //     transform = (function () {
  //       var prefs = ["t", "WebkitT", "MozT", "msT", "OT"],
  //         style = document.documentElement.style,
  //         p;
  //       for (var i = 0, len = prefs.length; i < len; i++) {
  //         if ((p = prefs[i] + "ransform") in style) return p;
  //       }

  //       alert("your browser doesnt support css transforms!");
  //     })(),
  //     rotate = function (x, y) {
  //       var deltaX = x - center.x,
  //         deltaY = y - center.y,
  //         // The atan2 method returns a numeric value between -pi and pi representing the angle theta of an (x,y) point.
  //         // This is the counterclockwise angle, measured in radians, between the positive X axis, and the point (x,y).
  //         // Note that the arguments to this function pass the y-coordinate first and the x-coordinate second.
  //         // atan2 is passed separate x and y arguments, and atan is passed the ratio of those two arguments.
  //         // * from Mozilla's MDN

  //         // Basically you give it an [y, x] difference of two points and it give you back an angle
  //         // The 0 point of the angle is left (the initial position of the picker is also left)

  //         angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

  //       // Math.atan2(deltaY, deltaX) => [-PI +PI]
  //       // We must convert it to deg so...
  //       // / Math.PI => [-1 +1]
  //       // * 180 => [-180 +180]

  //       return angle;
  //     },
  //     // DRAGSTART
  //     mousedown = function (event) {
  //       event.preventDefault();
  //       document.body.style.cursor = "move";
  //       mousemove(event);
  //       document.addEventListener("mousemove", mousemove);
  //       document.addEventListener("mouseup", mouseup);
  //     },
  //     // DRAG
  //     mousemove = function (event) {
  //       picker.style[transform] =
  //         "rotate(" + rotate(event.pageX, event.pageY) + "deg)";
  //     },
  //     // DRAGEND
  //     mouseup = function () {
  //       document.body.style.cursor = null;
  //       document.removeEventListener("mouseup", mouseup);
  //       document.removeEventListener("mousemove", mousemove);
  //     };

  //   // DRAG START
  //   pickerCircle.addEventListener("mousedown", mousedown);

  //   // ENABLE STARTING THE DRAG IN THE BLACK CIRCLE
  //   circle.addEventListener("mousedown", function (event) {
  //     if (event.target == this) mousedown(event);
  //   });
  // }, []);

  return (
    <div id="circle">
      <div id="circle-in"></div>
      <div id="picker">
        {/* <div id="picker-circle"></div> */}
      </div>
    </div>
  );
};

export default LightnessCircle;
