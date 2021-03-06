// @flow
import {
  CHROMA_SATURATION_PICKER_RADIUS,
  CHROMA_SATURATION_CIRCLE_OFFSET,
} from "./consts";

/**
 * Distance in pixels from given point to circle center.
 * @param {*} radius - radius of a circle.
 * @param {*} dx - y coordinate of a point.
 * @param {*} dy - x coordinate of a point.
 */
export const distanceFromCenter = (radius: number, dx: number, dy: number) => {
  return Math.min(radius, Math.sqrt(dx ** 2 + dy ** 2));
};

/**
 * Angle is calculated in radians, starts at mid-left point and
 * goes clockwise. Since Math.atan2 returns angle in radians
 * between [-π,π], transformed it to radians between [0,2π].
 * @param {*} dy - y coordinate of a point.
 * @param {*} dx - x coordinate of a point.
 */
export const calcAngleRadians = (dy: number, dx: number) => {
  let radians = Math.atan2(dy, -dx);
  if (radians < 0) {
    radians += 2 * Math.PI;
  }
  return radians;
};

const degreesToRadians = (degrees) => {
  let adjustedDegrees = degrees;
  if (adjustedDegrees > 180) {
    adjustedDegrees -= 360;
  }

  let radians = (adjustedDegrees - 180) * (Math.PI / 180);
  if (radians < -Math.PI) {
    radians += 2 * Math.PI;
  }

  return radians;
};

/**
 * Convert radians to degrees [0, 360].
 * @param {*} radians
 */
export const radiansToDegrees = (radians: number) => {
  return radians * (180 / Math.PI);
};

/**
 * Hue is calculated in degrees [0, 360], hue wheel starts at top point (red)
 * and goes clockwise.
 * @param {*} radians
 */
export const calcHue = (radians: number) => {
  let hue = radiansToDegrees(radians);
  if (hue < 0) {
    hue += 360;
  }
  return hue;
};

/**
 * Calculate saturation ([0, 100]) based on point coordinates (x, y).
 * @param {*} radius - radius of a circle.
 * @param {*} dx - x coordinate of a point.
 * @param {*} dy - y coordinate of a point.
 */
export const calcSaturation = (radius: number, dx: number, dy: number) => {
  return (distanceFromCenter(radius, dx, dy) * 100) / radius;
};

/**
 * Is chroma-saturation picker still within the circle.
 * @param {*} radius - radius of a circle.
 * @param {*} dx - x coordinate of a point.
 * @param {*} dy - y coordinate of a point.
 */
export const isPickerInside = (radius: number, dx: number, dy: number) => {
  dx = Math.abs(dx);
  dy = Math.abs(dy);

  if (dx + dy <= radius) {
    return true;
  }
  if (dx > radius) {
    return false;
  }
  if (dy > radius) {
    return false;
  }
  if (dx ** 2 + dy ** 2 <= radius ** 2) {
    return true;
  }

  return false;
};

// TODO: this can be recalculated only once after scrolls
export const calcWindowOffset = (el) => {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
  };
};

/**
 * Calculate where chroma-saturation picker should be
 * based on mouse position. If mouse is outside the wheel,
 * calculate angle and set picker on the outer edge of
 * circle at that angle.
 * @param {*} pageX
 * @param {*} pageY
 * @param {*} circle
 * @param {*} dx
 * @param {*} dy
 * @param {*} radius
 * @param {*} angle
 */
export const calcPickerCoords = (
  pageX,
  pageY,
  circle,
  dx,
  dy,
  radius,
  angle
) => {
  const { x: offsetX, y: offsetY } = calcWindowOffset(circle.current);

  // TODO: in this calculation x and y are off by -3 pixels. Not sure why, will need to investigate.
  let x = Math.abs(offsetX - pageX) - CHROMA_SATURATION_PICKER_RADIUS;
  let y = Math.abs(offsetY - pageY) - CHROMA_SATURATION_PICKER_RADIUS;

  if (!isPickerInside(radius, dx, dy)) {
    x =
      radius * Math.cos(angle + Math.PI) +
      radius +
      CHROMA_SATURATION_CIRCLE_OFFSET / 2;
    y =
      radius * Math.sin(angle + Math.PI) +
      radius +
      CHROMA_SATURATION_CIRCLE_OFFSET / 2;
  }

  return { x, y };
};

/**
 * Calculate picker coordinates from color
 * @param {*} color
 */
export const calcPickerCoordsFromColor = (radius: number, color) => {
  const hue = color[0];
  const saturation = color[1];
  const distance = (saturation * radius) / 100;
  const radians = degreesToRadians(hue);
  const x =
    Math.cos(radians) * distance + radius + CHROMA_SATURATION_CIRCLE_OFFSET / 2;
  const y =
    Math.sin(radians) * distance + radius + CHROMA_SATURATION_CIRCLE_OFFSET / 2;

  return { x, y };
};
