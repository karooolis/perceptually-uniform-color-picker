import React, { Component } from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import HCLPicker from "./hcl-picker";
import ColorSquareBig from "./color-square-big";
import Graph from "./graph";
import "./styles.css";
import {
  lchToRgb,
  findLuminanceBoundaries,
  findChromaBoundaries,
  findHueBoundaries,
} from "./calcs";
import ColorPicker from "./color-picker";

const DEFAULT_ROWS = 5;
const DEFAULT_COLUMNS = 5;
let DEFAULT_COLORS = [
  [
    [93.69196352439774, 6.568998992599872, 28.72155385100167],
    [86.04553307689092, 21.620868393983528, 43.25809807311287],
    [77.53877551468018, 38.12342296281648, 42.97057143001075],
    [69.73901157835462, 56.98609041802852, 43.78850145667037],
    [64.36841661294498, 72.61643365226274, 44.39849026107675],
  ],
  [
    [92.68028731992291, 9.55611899268981, 354.5175740342992],
    [81.86687625488233, 25.129836067196102, 355.5251252185594],
    [70.90859791289122, 42.22748813430879, 358.49656901522064],
    [61.07943379799744, 58.90424943025942, 2.0318231783520746],
    [54.97720130537013, 68.95081636971533, 6.090276629808185],
  ],
  [
    [92.86323917229872, 6.229630150628666, 284.2188968191893],
    [86.88456911941036, 18.629962436054495, 253.89429359173585],
    [79.04611409091727, 29.77153451589106, 256.76819152345445],
    [71.1521558128192, 40.18633576310194, 261.4290786213747],
    [65.48264080488826, 48.243595900251044, 266.757856096955],
  ],
  [
    [96.70517201508702, 8.067819376513041, 127.69140715084316],
    [91.66414708487221, 20.070804147471556, 126.93309502877229],
    [86.22443949758994, 32.87095634836311, 126.64052642303021],
    [80.8340720817277, 46.15347632647146, 125.9319254432286],
    [76.79549377854575, 56.40317904292413, 125.52120152485554],
  ],
  [
    [98.93869883830241, 11.167035928293478, 105.65485258501751],
    [97.2265437362978, 26.93635336295435, 103.26234796154544],
    [95.58038581740954, 44.45630634434066, 101.56600803722809],
    [94.0893970276764, 61.10490883648764, 99.91065325141041],
    [93.06467510577397, 72.60042785455863, 98.72781926280943],
  ],
];

class App extends Component {
  state = {
    idx: 1,
    rows: DEFAULT_ROWS,
    columns: DEFAULT_COLUMNS,
    colors: DEFAULT_COLORS,
  };

  findColorIdx = (idx) => {
    const { rows, columns } = this.state;
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
    const { row, col } = this.findColorIdx(this.state.idx);
    const colorsFlat = this.state.colors[row]; //  _.flatten(this.state.colors);
    const data = _.map(colorsFlat, (color, idx) => {
      const { color: rgb, impossible } = lchToRgb(color); // xyzToRgb(xyz);
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
    const { row, col } = this.findColorIdx(this.state.idx);
    const colorsFlat = this.state.colors[row]; // _.flatten(this.state.colors);
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

  getHueDataRow = () => {
    const { row, col } = this.findColorIdx(this.state.idx);
    const colorsFlat = this.state.colors[row]; // _.flatten(this.state.colors);
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

  getLuminanceDataCol = () => {
    const { row, col } = this.findColorIdx(this.state.idx);
    const colorsFlat = this.state.colors.map((colorsRow) => colorsRow[col]); //; _.flatten(this.state.colors);
    const data = _.map(colorsFlat, (color, idx) => {
      const { color: rgb, impossible } = lchToRgb(color); // xyzToRgb(xyz);
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

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
