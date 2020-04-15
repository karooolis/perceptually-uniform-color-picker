import React, { Component } from "react";

class HSLPicker extends Component {
  state = {
    hue: 50,
    saturation: 50,
    lightness: 50
  };

  onChange = evt => {
    const value = evt.target.value;
    this.setState(
      {
        ...this.state,
        [evt.target.name]: parseFloat(value)
      },
      () => {
        const { hue, saturation, lightness } = this.state;
        this.props.setColor([hue, saturation, lightness]);
      }
    );
  };

  render() {
    const { hue, saturation, lightness } = this.state;

    return (
      <div className="App">
        <div style={{ textAlign: "left" }}>
          <input
            type="range"
            name="hue"
            min="0"
            max="360"
            step="1"
            value={hue}
            onChange={this.onChange}
          />
          <label for="volume">hue</label>
        </div>

        <div style={{ textAlign: "left" }}>
          <input
            type="range"
            name="saturation"
            min="0"
            max="100"
            step="1"
            value={saturation}
            onChange={this.onChange}
          />
          <label for="volume">saturation</label>
        </div>

        <div style={{ textAlign: "left" }}>
          <input
            type="range"
            name="lightness"
            min="0"
            max="100"
            step="1"
            value={lightness}
            onChange={this.onChange}
          />
          <label for="volume">lightness</label>
        </div>

        {/* <div
          style={{
            height: 100,
            width: 100,
            background: hslToRgb(hue, saturation, lightness)
          }}
        /> */}
      </div>
    );
  }
}

export default HSLPicker;
