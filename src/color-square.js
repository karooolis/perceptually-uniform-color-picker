import React, { Component } from "react";
import convertColors from "color-space";

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
    const { idx, colors, mode, divider } = this.props;
    const rgb = convertColors.hsl.rgb(colors);
    const top = convertColors.hsl[mode](colors)[idx] / divider;

    return (
      <>
        <div
          style={{
            position: "absolute",
            left: `${idx * 50 + 40}px`,
            top: `${top}px`,
            height: "10px",
            width: "10px",
            background: `hsl(${colors[0]},${colors[1]}%,${colors[2]}%)`
          }}
        >
          {parseInt(convertColors.hsl[mode](colors)[idx])}
        </div>
      </>
    );
  }
}

export default Empty;
