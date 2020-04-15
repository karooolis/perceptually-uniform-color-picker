const _ = require("lodash");
const convertColors = require("color-space");

export const whitepoint = {
  //1931 2°
  2: {
    //incadescent
    A: [109.85, 100, 35.585],
    // B:[],
    C: [98.074, 100, 118.232],
    D50: [96.422, 100, 82.521],
    D55: [95.682, 100, 92.149],
    //daylight
    D65: [95.045592705167, 100, 108.9057750759878],
    D75: [94.972, 100, 122.638],
    //flourescent
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
    E: [100, 100, 100]
  },

  //1964  10°
  10: {
    //incadescent
    A: [111.144, 100, 35.2],
    C: [97.285, 100, 116.145],
    D50: [96.72, 100, 81.427],
    D55: [95.799, 100, 90.926],
    //daylight
    D65: [94.811, 100, 107.304],
    D75: [94.416, 100, 120.641],
    //flourescent
    F2: [103.28, 100, 69.026],
    F7: [95.792, 100, 107.687],
    F11: [103.866, 100, 65.627],
    E: [100, 100, 100]
  }
};

export const xyzToRgb = _xyz => {
  //FIXME: make sure we have to divide like this. Probably we have to replace matrix as well then
  const white = whitepoint[2].E;

  var x = _xyz[0] / white[0],
    y = _xyz[1] / white[1],
    z = _xyz[2] / white[2],
    r,
    g,
    b;

  // assume sRGB
  // http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
  r = x * 3.240969941904521 + y * -1.537383177570093 + z * -0.498610760293;
  g = x * -0.96924363628087 + y * 1.87596750150772 + z * 0.041555057407175;
  b = x * 0.055630079696993 + y * -0.20397695888897 + z * 1.056971514242878;

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1.0 / 2.4) - 0.055 : (r = r * 12.92);

  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1.0 / 2.4) - 0.055 : (g = g * 12.92);

  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1.0 / 2.4) - 0.055 : (b = b * 12.92);

  let impossible = false;
  if (r > 1 || g > 1 || b > 1 || r < 0 || g < 0 || b < 0) {
    impossible = true;
  }

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return {
    impossible: impossible,
    color: [r * 255, g * 255, b * 255]
  };
};

export const lchToRgb = lch => {
  const xyz = convertColors.lchab.xyz(lch);
  const { color, impossible } = xyzToRgb(xyz);

  return {
    impossible,
    color
  };
};

// const hues = [...Array(360).keys()]

// const idx1 = _.findIndex(hues, hue => {
//   const {impossible, color} = lchToRgb([50, 50, hue]);

//   return !impossible;
// })

// const idx2 = _.findIndex(hues.slice(idx1), hue => {
//   const {impossible, color} = lchToRgb([50, 50, hue]);

//   return impossible;
// })

// console.log(idx1, idx2);

export const findBoundaries = color => {
  // const hues = [...Array(360).keys()];
  // const min = _.findIndex(chromas, chroma => {
  //   const { impossible, color } = lchToRgb([50, chroma, 50]);
  //   return !impossible;
  // });
  // const max = _.findIndex(chromas.slice(idx1), chroma => {
  //   const { impossible, color } = lchToRgb([50, chroma, 50]);
  //   return impossible;
  // });

  return {
    min: Math.floor(Math.random() * 100 + 1),
    max: Math.floor(Math.random() * 100 + 1)
  };

  // const chromas = [...Array(100).keys()];
  // const idx1 = _.findIndex(chromas, chroma => {
  //   const { impossible, color } = lchToRgb([50, chroma, 50]);
  //   return !impossible;
  // });
  // const idx2 = _.findIndex(chromas.slice(idx1), chroma => {
  //   const { impossible, color } = lchToRgb([50, chroma, 50]);
  //   return impossible;
  // });
  // console.log(idx1, idx2 + idx1);
  // const luminances = [...Array(100).keys()];
  // const idx3 = _.findIndex(luminances, luminance => {
  //   const { impossible, color } = lchToRgb([luminance, 50, 50]);
  //   return !impossible;
  // });
  // const idx4 = _.findIndex(luminances.slice(idx3), luminance => {
  //   const { impossible, color } = lchToRgb([luminance, 50, 50]);
  //   return impossible;
  // });
  // console.log(idx3, idx4 + idx3);
};

export const findChromaBoundaries = color => {
  const chromas = [...Array(100).keys()];

  const luminance = color[0];
  const hue = color[2];

  const min = _.findIndex(chromas, chroma => {
    const { impossible, color } = lchToRgb([luminance, chroma, hue]);
    return !impossible;
  });
  const max = _.findIndex(chromas.slice(min), chroma => {
    const { impossible, color } = lchToRgb([luminance, chroma, hue]);
    return impossible;
  });

  return {
    min,
    max
  };
};

export const findLuminanceBoundaries = color => {
  const luminances = [...Array(100).keys()];

  const chroma = color[1];
  const hue = color[2];

  const min = _.findIndex(luminances, luminance => {
    const { impossible, color } = lchToRgb([luminance, chroma, hue]);
    return !impossible;
  });
  const max = _.findIndex(luminances.slice(min), luminance => {
    const { impossible, color } = lchToRgb([luminance, chroma, hue]);
    return impossible;
  });

  return {
    min,
    max
  };
};

export const findHueBoundaries = color => {
  const hues = [...Array(360).keys()];

  const chroma = color[1];
  const luminance = color[0];

  const min = _.findIndex(hues, hue => {
    const { impossible, color } = lchToRgb([luminance, chroma, hue]);
    return impossible;
  });
  const max = _.findIndex(hues.slice(min), hue => {
    const { impossible, color } = lchToRgb([luminance, chroma, hue]);
    return !impossible;
  });

  return {
    min,
    max
  };
};
