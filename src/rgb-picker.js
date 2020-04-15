import React, { Component } from "react";

class RGBPicker extends Component {
  state = {
    red: 122,
    green: 122,
    blue: 122
  };

  onChange = evt => {
    const value = evt.target.value;
    this.setState(
      {
        ...this.state,
        [evt.target.name]: value
      },
      () => {
        const { red, green, blue } = this.state;
        this.props.setColor([red, green, blue]);
      }
    );
  };

  render() {
    const { red, green, blue } = this.state;

    return (
      <div className="App">
        <div style={{ textAlign: "left" }}>
          <input
            type="range"
            name="red"
            min="0"
            max="255"
            step="1"
            value={red}
            onChange={this.onChange}
          />
          <label for="volume">red</label>
        </div>

        <div style={{ textAlign: "left" }}>
          <input
            type="range"
            name="green"
            min="0"
            max="255"
            step="1"
            value={green}
            onChange={this.onChange}
          />
          <label for="volume">green</label>
        </div>

        <div style={{ textAlign: "left" }}>
          <input
            type="range"
            name="blue"
            min="0"
            max="255"
            step="1"
            value={blue}
            onChange={this.onChange}
          />
          <label for="volume">blue</label>
        </div>

        {/* <div
          style={{
            height: 100,
            width: 100,
            background: `rgb(${red}, ${green}, ${blue})`
          }}
        /> */}
      </div>
    );
  }
}

export default RGBPicker;
