import React, { useEffect } from "react";

function ColorPicker(element) {
  this.element = element;

  this.init = function () {
    var diameter = this.element.offsetWidth;

    var canvas = document.createElement("canvas");
    this.canvas = canvas;

    canvas.height = diameter;
    canvas.width = diameter;


    this.renderColorMap();

    element.appendChild(canvas);

    this.setupBindings();
  };

  this.renderColorMap = function () {
    var canvas = this.canvas;
    var ctx = canvas.getContext("2d");
    ctx.translate(0.5, 0.5)
    ctx.imageSmoothingEnabled = false;

    var radius = canvas.width / 2;
    var toRad = (2 * Math.PI) / 360;
    var step = 1 / radius;

    console.log(step);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var cx = radius;
    var cy = radius;

    for (var i = 0; i < 360; i += step) {
      var rad = i * toRad;
      var x = radius * Math.cos(rad),
        y = radius * Math.sin(rad);

      ctx.strokeStyle = "hsl(" + i + ", 100%, 50%)";

      ctx.beginPath();
      ctx.moveTo(radius, radius);
      ctx.lineTo(cx + x, cy + y);
      ctx.stroke();
    }

    // draw saturation gradient
    var grd = ctx.createRadialGradient(cx, cy, 0, cx, cx, radius);
    grd.addColorStop(0, "white");
    grd.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grd;
    //ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    // ctx.imageSmoothingEnabled = true;


    // render the rainbow box here ----------
  };

  this.renderMouseCircle = function (x, y) {
    var canvas = this.canvas;
    var ctx = canvas.getContext("2d");

    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = "3";
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  this.setupBindings = function () {
    var canvas = this.canvas;
    var ctx = canvas.getContext("2d");
    var self = this;

    canvas.addEventListener(
      "click",
      function (e) {
        var x = e.offsetX || e.clientX - this.offsetLeft;
        var y = e.offsetY || e.clientY - this.offsetTop;

        var imgData = ctx.getImageData(x, y, 1, 1).data;
        //var selectedColor = new Color(imgData[0], imgData[1], imgData[2]);
        // do something with this

        self.renderMouseCircle(x, y);
      },
      false
    );
  };

  function rgbToHsv(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;

    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h,
      s,
      v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h, s, v];
  }

  this.plotRgb = function (r, g, b) {
    var canvas = this.canvas;
    var ctx = canvas.getContext("2d");

    var [h, s, v] = rgbToHsv(r, g, b);
    var theta = h * 2 * Math.PI;
    var maxRadius = canvas.width / 2;
    var r = s * maxRadius;
    var x = r * Math.cos(theta) + maxRadius,
      y = r * Math.sin(theta) + maxRadius;
    this.renderMouseCircle(x, y);
  };
}

const ColorWheel = () => {
  useEffect(() => {
    var pick = new ColorPicker(document.querySelector("#color-space"));
    console.log('pick', pick)

    pick.init()

    var RGBList = [
      /*     {'r':231,'g':52,'b':35},
        {'r':255,'g':128,'b':128},
        {'r':153,'g':77,'b':77},
        {'r':24,'g':111,'b':24}, */
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 128, b: 128 },
      { r: 153, g: 77, b: 77 },
    ];

    RGBList.forEach(function (color) {
      pick.plotRgb(color.r, color.g, color.b);
    });
  }, []);

  return (
    <div
      id="color-space"
      style={{
        width: 400,
        height: 400,
      }}
    ></div>
  );
};

export default ColorWheel;
