// @flow
import { useMemo } from "react";
import _ from "lodash";
import convertColors from "color-space";

export const whitepoint = [100, 100, 100];

export const xyzToRgb = (_xyz) => {
  // FIXME: make sure we have to divide like this. Probably we have to replace matrix as well then
  const white = whitepoint;

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

export const lchToRgb = (lch) => {
  const xyz = convertColors.lchab.xyz(lch);
  const { color, impossible } = xyzToRgb(xyz);

  return {
    impossible,
    color,
  };
};

export const findBoundaries = (color) => {
  return {
    min: Math.floor(Math.random() * 100 + 1),
    max: Math.floor(Math.random() * 100 + 1),
  };
};

export const findChromaBoundaries = (color) => {
  const chromas = [...Array(100).keys()];

  const luminance = color[0];
  const hue = color[2];

  const min = _.findIndex(chromas, (chroma) => {
    const { impossible, color } = lchToRgb([luminance, chroma, hue]);
    return !impossible;
  });
  const max = _.findIndex(chromas.slice(min), (chroma) => {
    const { impossible, color } = lchToRgb([luminance, chroma, hue]);
    return impossible;
  });

  return {
    min,
    max,
  };
};

export const findLuminanceBoundaries = (color) => {
  const luminances = [...Array(100).keys()];

  const chroma = color[1];
  const hue = color[2];

  const min = _.findIndex(luminances, (luminance) => {
    const { impossible } = lchToRgb([luminance, chroma, hue]);
    return !impossible;
  });
  const max = _.findIndex(luminances.slice(min), (luminance) => {
    const { impossible } = lchToRgb([luminance, chroma, hue]);
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
    const { impossible } = lchToRgb([luminance, chroma, hue]);
    return impossible;
  });
  const max = _.findIndex(hues.slice(min), (hue) => {
    const { impossible } = lchToRgb([luminance, chroma, hue]);
    return !impossible;
  });

  return {
    min,
    max,
  };
};

export const getGraphData = (colors, colorIdx) => {
  // TODO: handle row and col selection
  const graphColors = colors[colorIdx.row];
  const data = _.map(graphColors, (color, idx) => {
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

  // TODO: perhaps there is a better way to handle line
  // trail-offs than adding these extra hidden points
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
