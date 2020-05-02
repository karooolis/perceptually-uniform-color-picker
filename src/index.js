import React, { useState, useMemo, useCallback } from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
import spaces from "color-space";
import ColorSquareBig from "./color-square-big";
import Graph from "./graph";
import "./styles.css";
import {
  lchToRgb,
  findLuminanceBoundaries,
  findChromaBoundaries,
  findHueBoundaries,
} from "./utils";
import { DEFAULT_COLORS } from "./consts";
import ColorPicker from "./color-picker";

const App = () => {
  const [colorIdx, setColorIdx] = useState([0, 0]);
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const { rows, cols } = useMemo(
    () => ({ rows: 5, cols: 5 }), // TODO: { rows: colors[0].length, cols: colors.length },
    []
  );

  const color = useMemo(() => _.get(colors, colorIdx), [colorIdx, colors]);
  const setColor = useCallback(
    (color) => {
      const newColors = _.set(_.clone(colors), colorIdx, color);
      setColors(newColors);
    },
    [colorIdx, colors]
  );

  console.log(color)

  return (
    <>
      <div
        style={{
          display: "grid",
          marginBottom: "50px",
          gridTemplateRows: `repeat(${rows}, 65px)`,
          gridTemplateColumns: `repeat(${cols}, 65px)`,
        }}
      >
        {_.map(colors, (colorsRow, rowIdx) =>
          _.map(colorsRow, (color, colIdx) => {
            const idx = [rowIdx, colIdx];
            const selected = rowIdx === colorIdx[0] && colIdx === colorIdx[1];
            return (
              <ColorSquareBig
                key={`color-${rowIdx}-${colIdx}`}
                idx={idx}
                color={color}
                selected={selected}
                setColorIdx={setColorIdx}
              />
            );
          })
        )}
      </div>

      <ColorPicker color={color} colorIdx={colorIdx} setColor={setColor} />
    </>
  );
};

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
