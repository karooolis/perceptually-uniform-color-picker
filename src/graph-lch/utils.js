// @flow
import _ from "lodash";
import spaces from "color-space";
import { LUMINANCE, CHROMA, HUE } from "./consts";
import type { Color, ColorIdx, Colors } from "..";
import type { GraphType } from "./consts";

const whitepoint = {
  // 1931 2°
  2: {
    // incadescent
    A: [109.85, 100, 35.585],
    // B:[],
    C: [98.074, 100, 118.232],
    D50: [96.422, 100, 82.521],
    D55: [95.682, 100, 92.149],
    // daylight
    D65: [95.045592705167, 100, 108.9057750759878],
    D75: [94.972, 100, 122.638],
    // flourescent
    // F1: [],
    F2: [99.187, 100, 67.395],
    // F3: [],
    // F4: [],
    // F5: [],
    // F6:[],
    F7: [95.044, 100, 108.755],
    // F8: [],
    // F9: [],
    // F10: [],
    F11: [100.966, 100, 64.37],
    // F12: [],
    E: [100, 100, 100],
  },

  // 1964  10°
  10: {
    // incadescent
    A: [111.144, 100, 35.2],
    C: [97.285, 100, 116.145],
    D50: [96.72, 100, 81.427],
    D55: [95.799, 100, 90.926],
    // daylight
    D65: [94.811, 100, 107.304],
    D75: [94.416, 100, 120.641],
    // flourescent
    F2: [103.28, 100, 69.026],
    F7: [95.792, 100, 107.687],
    F11: [103.866, 100, 65.627],
    E: [100, 100, 100],
  },
};

const xyzToRgb = (_xyz) => {
  // FIXME: make sure we have to divide like this. Probably we have to replace matrix as well then
  const white = whitepoint[2].E;

  const x = _xyz[0] / white[0];
  const y = _xyz[1] / white[1];
  const z = _xyz[2] / white[2];
  let r;
  let g;
  let b;

  // assume sRGB
  // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
  r = x * 3.240969941904521 + y * -1.537383177570093 + z * -0.498610760293;
  g = x * -0.96924363628087 + y * 1.87596750150772 + z * 0.041555057407175;
  b = x * 0.055630079696993 + y * -0.20397695888897 + z * 1.056971514242878;

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1.0 / 2.4) - 0.055 : (r *= 12.92);

  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1.0 / 2.4) - 0.055 : (g *= 12.92);

  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1.0 / 2.4) - 0.055 : (b *= 12.92);

  let impossible = false;
  if (r > 1 || g > 1 || b > 1 || r < 0 || g < 0 || b < 0) {
    impossible = true;
  }

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return {
    impossible,
    color: [r * 255, g * 255, b * 255],
  };
};

export const findBoundaries = (color) => {
  return {
    min: Math.floor(Math.random() * 100 + 1),
    max: Math.floor(Math.random() * 100 + 1),
  };
};

const isColorImpossible = (lch) => {
  const xyz = spaces.lchab.xyz(lch);
  const { impossible } = xyzToRgb(xyz);

  return impossible;
};

export const hslToRgb = (hsl) => {
  const xyz = spaces.hsl.xyz(hsl);
  const { color, impossible } = xyzToRgb(xyz);

  return {
    impossible,
    color,
  };
};

export const lchToRgb = (lch) => {
  const xyz = spaces.lchab.xyz(lch);
  const { color, impossible } = xyzToRgb(xyz);

  return {
    impossible,
    color,
  };
};

/**
 * Find chroma boundaries which are possible for a given
 * color's luminance and hue.
 * @param {*} color - color in LCHab color mode
 */
const findChromaBoundaries = (color: Color) => {
  const [luminance, , hue] = color;
  let max = 100;

  for (let chroma = 0; chroma <= max; chroma++) {
    const newColor = [luminance, chroma, hue];
    if (isColorImpossible(newColor)) {
      max = chroma;
      break;
    }
  }

  return {
    min: 0, // chroma can't get below 0
    max,
  };
};

export const findLuminanceBoundaries = (color) => {
  const luminances = [...Array(100).keys()];

  const chroma = color[1];
  const hue = color[2];

  const min = _.findIndex(luminances, (luminance) => {
    const { impossible } = hslToRgb([luminance, chroma, hue]);
    return !impossible;
  });
  const max = _.findIndex(luminances.slice(min), (luminance) => {
    const { impossible } = hslToRgb([luminance, chroma, hue]);
    return impossible;
  });

  return {
    min,
    max,
  };
};

export const findHueBoundaries = (color) => {
  const hues = [...Array(360).keys()];

  const chroma = color[1];
  const luminance = color[0];

  const min = _.findIndex(hues, (hue) => {
    const { impossible } = hslToRgb([luminance, chroma, hue]);
    return impossible;
  });

  const max = _.findIndex(hues.slice(min), (hue) => {
    const { impossible } = hslToRgb([luminance, chroma, hue]);
    return !impossible;
  });

  return {
    min,
    max,
  };
};

// Currently, this calclulates data for chroma graph. Need to abstract away to handle all primaries.
export const getGraphData = (
  colors: Colors,
  colorIdx: ColorIdx,
  type: GraphType
) => {
  // TODO: handle both row and col selection
  const graphColors = colors[colorIdx.row];
  const colorBoundariesFn = {
    [LUMINANCE]: findLuminanceBoundaries,
    [CHROMA]: findChromaBoundaries,
    [HUE]: findHueBoundaries,
  };

  const data = _.map(graphColors, (color, idx) => {
    const lchColor = spaces.hsl.lchab(color);
    // const { color: rgb, impossible } = hslToRgb(color);
    const { max, min } = colorBoundariesFn[type](lchColor);

    return {
      idx: parseInt(idx, 10) + 0.5,
      bottom: min,
      top: max,
      actual: lchColor[1],
      color,
    };
  });

  // TODO: perhaps there is a better way to handle graph line trail-offs than adding these extra hidden points
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
