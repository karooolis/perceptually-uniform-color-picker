// @flow
import React, { useState, useMemo, useCallback } from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { Client as Styletron } from "styletron-engine-atomic";
import ColorSquareBig from "./color-square-big";
import "./styles.css";
import { DEFAULT_COLORS } from "./consts";
import GraphLCH from "./graph-lch/index";
import ColorPicker from "./color-picker";

export type ColorIdx = {| row: number, col: number |}; // row, col
export type Color = [number, number, number]; // hue, saturation, lightness
export type Colors = Array<Array<Color>>;

const App = () => {
  const [colorIdx, setColorIdx] = useState({ row: 0, col: 0 });
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const { rows, cols } = useMemo(
    () => ({ rows: 5, cols: 5 }), // TODO: allow to add/remove rows/cols,
    []
  );

  const color = useMemo(() => _.get(colors, [colorIdx.row, colorIdx.col]), [
    colorIdx,
    colors,
  ]);

  const setColor = useCallback(
    (newColor: string) => {
      const newColors = _.set(
        _.clone(colors),
        [colorIdx.row, colorIdx.col],
        newColor
      );
      setColors(newColors);
    },
    [colorIdx, colors]
  );

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
            const idx = { row: rowIdx, col: colIdx };
            const selected = rowIdx === colorIdx.row && colIdx === colorIdx.col;
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
      <GraphLCH
        title="test"
        customKey="test"
        colorIdx={colorIdx}
        colors={colors}
        row
      />
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
