// @flow

export const LUMINANCE = "luminance";
export const CHROMA = "chroma";
export const HUE = "hue";
const GRAPH_TYPE = {
  [LUMINANCE]: LUMINANCE,
  [CHROMA]: CHROMA,
  [HUE]: HUE,
};

export type GraphType = $Keys<typeof GRAPH_TYPE>;
