import React, { Component } from "react";
import spaces from "color-space";
import contrast from "get-contrast";

class ColorSquareBig extends Component {
  render() {
    const { idx, colors, selectedIdx } = this.props;
    const rgb = spaces.lchab.rgb(colors);

    return (
      <div
        onClick={this.props.setIdx}
        style={{
          textAlign: "center",
          paddingTop: "20px",
          cursor: "pointer",
          border: idx === selectedIdx ? "2px solid #000" : "none",
          background: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
          color: "#e65100"
        }}
      >
        {this.props.showContrast &&
          parseFloat(
            contrast
              .ratio("#e65100", `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`)
              .toFixed(2)
          )}
      </div>
    );
  }
}

export default ColorSquareBig;
