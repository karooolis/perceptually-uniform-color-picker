import React, { Component } from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
import HCLPicker from "./hcl-picker";
import ColorSquareBig from "./color-square-big";
import Graph from "./graph";
import "./styles.css";
import {
  lchToRgb,
  findLuminanceBoundaries,
  findChromaBoundaries,
  findHueBoundaries,
} from "./utils";
import { DEFAULT_ROWS, DEFAULT_COLUMNS, DEFAULT_COLORS } from "./consts";
import ColorPicker from "./color-picker";

class App extends Component {
  state = {
    idx: 1,
    rows: DEFAULT_ROWS,
    columns: DEFAULT_COLUMNS,
    colors: DEFAULT_COLORS,
  };

  findColorIdx = (idx) => {
    const { rows } = this.state;
    const row = Math.ceil(idx / rows) - 1;
    const left = rows * row;
    const col = idx - left - 1;

    return { row: row || 0, col: col || 0 };
  };

  setColor = (color) => {
    const { idx, colors } = this.state;
    const { row, col } = this.findColorIdx(idx);

    const newColors = _.clone(colors);
    newColors[row][col] = color;

    this.setState({
      colors: newColors,
    });
  };

  getLuminanceDataRow = () => {
    const { row } = this.findColorIdx(this.state.idx);
    const colorsFlat = this.state.colors[row];
    const data = _.map(colorsFlat, (color, idx) => {
      const { max, min } = findLuminanceBoundaries(color);

      return {
        idx: parseInt(idx, 10) + 0.5,
        bottom: min,
        top: max,
        actual: color[0],
        color,
      };
    });

    return [
      {
        ...data[0],
        idx: 0,
      },
      ...data,
      {
        ...data[data.length - 1],
        idx: data.length,
      },
    ];
  };

  getChromaDataRow = () => {
    const { row } = this.findColorIdx(this.state.idx);
    const colorsFlat = this.state.colors[row];
    const data = _.map(colorsFlat, (color, idx) => {
      const { max, min } = findChromaBoundaries(color);

      return {
        idx: parseInt(idx, 10) + 0.5,
        bottom: min,
        top: max,
        actual: color[1],
        color,
      };
    });

    return [
      {
        ...data[0],
        idx: 0,
      },
      ...data,
      {
        ...data[data.length - 1],
        idx: data.length,
      },
    ];
  };

  getHueDataRow = () => {
    const { row } = this.findColorIdx(this.state.idx);
    const colorsFlat = this.state.colors[row];
    const data = _.map(colorsFlat, (color, idx) => {
      const { max, min } = findHueBoundaries(color);

      return {
        idx: parseInt(idx, 10) + 0.5,
        bottom: min,
        top: max,
        actual: color[2],
        color,
      };
    });

    return [
      {
        ...data[0],
        idx: 0,
      },
      ...data,
      {
        ...data[data.length - 1],
        idx: data.length,
      },
    ];
  };

  getLuminanceDataCol = () => {
    const { col } = this.findColorIdx(this.state.idx);
    const colorsFlat = this.state.colors.map((colorsRow) => colorsRow[col]);
    const data = _.map(colorsFlat, (color, idx) => {
      const { max, min } = findLuminanceBoundaries(color);

      return {
        idx: parseInt(idx, 10) + 0.5,
        bottom: min,
        top: max,
        actual: color[0],
        color,
      };
    });

    return [
      {
        ...data[0],
        idx: 0,
      },
      ...data,
      {
        ...data[data.length - 1],
        idx: data.length,
      },
    ];
  };

  getChromaDataCol = () => {
    const { row, col } = this.findColorIdx(this.state.idx);
    const colorsFlat = this.state.colors.map((colorsRow) => colorsRow[col]); //; _.flatten(this.state.colors);
    const data = _.map(colorsFlat, (color, idx) => {
      const { color: rgb, impossible } = lchToRgb(color); // xyzToRgb(xyz);
      const { max, min } = findChromaBoundaries(color);

      return {
        idx: parseInt(idx, 10) + 0.5,
        bottom: min,
        top: max,
        actual: color[1],
        color,
      };
    });

    return [
      {
        ...data[0],
        idx: 0,
      },
      ...data,
      {
        ...data[data.length - 1],
        idx: data.length,
      },
    ];
  };

  getHueDataCol = () => {
    const { row, col } = this.findColorIdx(this.state.idx);
    const colorsFlat = this.state.colors.map((colorsRow) => colorsRow[col]); //; _.flatten(this.state.colors);
    const data = _.map(colorsFlat, (color, idx) => {
      const { color: rgb, impossible } = lchToRgb(color); // xyzToRgb(xyz);
      const { max, min } = findHueBoundaries(color);

      return {
        idx: parseInt(idx, 10) + 0.5,
        bottom: min,
        top: max,
        actual: color[2],
        color,
      };
    });

    return [
      {
        ...data[0],
        idx: 0,
      },
      ...data,
      {
        ...data[data.length - 1],
        idx: data.length,
      },
    ];
  };

  render() {
    const { idx, colors, rows, columns } = this.state;
    const { row, col } = this.findColorIdx(this.state.idx);
    const colorsRow = this.state.colors[row];
    const colorsCol = this.state.colors.map((colorsRow) => colorsRow[col]);
    const colorsFlat = _.flatten(colors);

    return (
      <div>
        <div style={{ float: "left", marginRight: "100px" }}>
          <div
            style={{
              display: "grid",
              marginBottom: "50px",
              gridTemplateRows: `repeat(${rows}, 65px)`,
              gridTemplateColumns: `repeat(${columns}, 65px)`,
            }}
          >
            {_.map(colorsFlat, (color, newIdx) => {
              return (
                <ColorSquareBig
                  idx={newIdx + 1}
                  selectedIdx={idx}
                  colors={color}
                  showContrast={true}
                  setIdx={() => this.setState({ idx: newIdx + 1 })}
                />
              );
            })}
          </div>

          <ColorPicker />

          <HCLPicker setColor={this.setColor} />
        </div>

        <div style={{ width: "450px", float: "left" }}>
          <div
            style={{
              display: "grid",
              gridTemplateRows: `repeat(1, 30px)`,
              gridTemplateColumns: `repeat(${rows}, 30px)`,
            }}
          >
            {_.map(colorsRow, (color, newIdx) => {
              return (
                <ColorSquareBig
                  idx={newIdx + 1}
                  selectedIdx={idx}
                  colors={color}
                  setIdx={() => this.setState({ idx: newIdx + 1 })}
                />
              );
            })}
          </div>

          <Graph
            customKey="luminance2"
            title="Luminance (lightness)"
            data={this.getLuminanceDataRow()}
          />
          <Graph
            customKey="chroma2"
            title="Chroma (saturation)"
            data={this.getChromaDataRow()}
          />
          {/* <GraphHue customKey="hue2" title="Hue" data={this.getHueDataRow()} /> */}
        </div>

        <div style={{ width: "450px", marginTop: "0", float: "left" }}>
          <div
            style={{
              display: "grid",
              gridTemplateRows: `repeat(1, 30px)`,
              gridTemplateColumns: `repeat(${columns}, 30px)`,
            }}
          >
            {_.map(colorsCol, (color, newIdx) => {
              return (
                <ColorSquareBig
                  idx={newIdx + 1}
                  selectedIdx={idx}
                  colors={color}
                  setIdx={() => this.setState({ idx: newIdx + 1 })}
                />
              );
            })}
          </div>

          <Graph
            customKey="luminance1"
            title="Luminance (lightness)"
            data={this.getLuminanceDataCol()}
          />
          <Graph
            customKey="chroma1"
            title="Chroma (saturation)"
            data={this.getChromaDataCol()}
          />
          {/* <GraphHue customKey="hue1" title="Hue" data={this.getHueDataCol()} /> */}
        </div>
      </div>
    );
  }
}

export default App;

const debug =
  process.env.NODE_ENV === "production" ? void 0 : new DebugEngine();
const engine = new Styletron();

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StyletronProvider value={engine} debug={debug} debugAfterHydration>
    <App />
  </StyletronProvider>,
  rootElement
);
