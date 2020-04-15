import React, { Component } from "react";

class HCLPicker extends Component {
  state = {
    hue: 50,
    chroma: 50,
    luminance: 50
  };

  onChange = evt => {
    const value = evt.target.value;
    this.setState(
      {
        ...this.state,
        [evt.target.name]: parseFloat(value)
      },
      () => {
        const { hue, chroma, luminance } = this.state;
        this.props.setColor([luminance, chroma, hue]);
      }
    );
  };

  render() {
    const { hue, chroma, luminance } = this.state;
    return (
      <div className="App">
        <div style={{ textAlign: "left" }}>
          <input
            type="range"
            name="luminance"
            min="0"
            max="100"
            step="1"
            value={luminance}
            onChange={this.onChange}
          />
          <label for="volume">luminance</label>
        </div>

        <div style={{ textAlign: "left" }}>
          <input
            type="range"
            name="chroma"
            min="0"
            max="100"
            step="1"
            value={chroma}
            onChange={this.onChange}
          />
          <label for="volume">chroma</label>
        </div>

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
      </div>
    );
  }
}

export default HCLPicker;
