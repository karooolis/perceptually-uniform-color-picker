import React, { Component } from "react";
import convertColors from "color-space";
import ColorSquare from "./color-square";
import { lchToRgb, findBoundaries } from "./calcs";

class Empty extends Component {
  state = {
    lightness: 50,
    a: 50,
    b: 50
  };

  onChange = evt => {
    const value = evt.target.value;
    this.setState({
      ...this.state,
      [evt.target.name]: value
    });
  };

  render() {
    const { colors } = this.props;
    const lchab = convertColors.lchab.lchab(colors[0]);
    const hsl = convertColors.lchab.hsl(colors[0]);
    const hsluv = convertColors.lchab.hsluv(colors[0]);
    const cielab = convertColors.lchab.lab(colors[0]);
    const xyz = convertColors.lchab.xyz(colors[0]);
    const { color: rgb, impossible } = lchToRgb(colors[0]); // xyzToRgb(xyz);
    const { max, min } = findBoundaries(colors[0]);

    return (
      <div>
        <h2>Hue</h2>
        {/* <p>
          lchab = {parseInt(lchab[0])}, {parseInt(lchab[1])},{" "}
          {parseInt(lchab[2])}
        </p>
        <p>
          HSL = {parseInt(hsl[0])}, {parseInt(hsl[1])}, {parseInt(hsl[2])}
        </p>
        <p>
          HSLuv = {parseInt(hsluv[0])}, {parseInt(hsluv[1])},{" "}
          {parseInt(hsluv[2])}
        </p>
        <p>
          CIELAB = {parseInt(cielab[0])}, {parseInt(cielab[1])},{" "}
          {parseInt(cielab[2])}
        </p> */}

        <p>
          lchab = {parseInt(lchab[0])}, {parseInt(lchab[1])},{" "}
          {parseInt(lchab[2])}
        </p>
        <p>
          XYZ = {parseInt(xyz[0])}, {parseInt(xyz[1])}, {parseInt(xyz[2])}
        </p>
        <p style={{ color: impossible ? "red" : "black" }}>
          RGB = {parseInt(rgb[0])}, {parseInt(rgb[1])}, {parseInt(rgb[2])}{" "}
        </p>

        {/* <h4>HSL</h4>
        <div
          style={{
            height: 100,
            width: 200,
            marginTop: 10,
            border: "1px solid gray",
            position: "relative"
          }}
        >
          <ColorSquare colors={colors[0]} idx={0} mode="hsl" divider={3.6} />
          <ColorSquare colors={colors[1]} idx={1} mode="hsl" divider={1} />
          <ColorSquare colors={colors[2]} idx={2} mode="hsl" divider={1} />
        </div>
        
        <h4>HSLuv</h4>
        <div
          style={{
            height: 100,
            width: 200,
            marginTop: 10,
            border: "1px solid gray",
            position: "relative"
          }}
        >
          <ColorSquare colors={colors[0]} idx={0} mode="hsluv" divider={3.6} />
          <ColorSquare colors={colors[1]} idx={1} mode="hsluv" divider={1} />
          <ColorSquare colors={colors[2]} idx={2} mode="hsluv" divider={1} />
        </div> */}
      </div>
    );
  }
}

export default Empty;
