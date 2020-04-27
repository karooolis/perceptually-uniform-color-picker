import React from "react";
import spaces from "color-space";
import contrast from "get-contrast";

const ColorSquareBig = ({ idx, color, selected, setColorIdx }) => {
  const rgb = spaces.lchab.rgb(color);
  const rgbStr = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`; // TODO: move to utils

  return (
    <div
      onClick={() => setColorIdx(idx)}
      style={{
        textAlign: "center",
        paddingTop: "20px",
        cursor: "pointer",
        border: selected ? "2px solid #000" : "none",
        background: rgbStr,
        color: "#e65100",
      }}
    >
      {parseFloat(contrast.ratio("#e65100", rgbStr).toFixed(2))}
    </div>
  );
};

export default ColorSquareBig;
