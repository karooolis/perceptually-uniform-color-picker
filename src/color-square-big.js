// @flow
import React from "react";
import { hslCssStr } from "./utils";
import type { ColorIdx, Color } from ".";

type Props = {|
  idx: ColorIdx,
  color: Color,
  setColorIdx: (ColorIdx) => void,
  selected: boolean,
|};

const ColorSquareBig = ({ idx, color, selected, setColorIdx }: Props) => {
  return (
    <div
      onClick={() => setColorIdx(idx)}
      style={{
        textAlign: "center",
        paddingTop: "20px",
        cursor: "pointer",
        border: selected ? "2px solid #000" : "none",
        background: hslCssStr(color),
        color: "#e65100",
      }}
    >
      {/* TODO: {parseFloat(contrast.ratio("#e65100", rgbStr).toFixed(2))} */}
    </div>
  );
};

export default ColorSquareBig;
