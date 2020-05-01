export const distanceFromCenter = (radius, dx, dy) => {
  return Math.min(radius, Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
};

// Rotation is in radians
export const calcRotation = (dy, dx) => {
  let rotation = Math.atan2(dy, dx);
  if (rotation < 0) {
    rotation += 2 * Math.PI;
  }
  return rotation;
};

export const calcHue = (rotation) => {
  return ((rotation + 1.5708) * (180 / Math.PI)) % 360;
};

export const calcSaturation = (radius, dx, dy) => {
  return (distanceFromCenter(radius, dx, dy) * 100) / radius;
};

export const isPickerInside = (dx, dy, radius) => {
  dx = Math.abs(dx);
  dy = Math.abs(dy);

  if (dx + dy <= radius) {
    return true;
  } else if (dx > radius) {
    return false;
  } else if (dy > radius) {
    return false;
  } else if (Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(radius, 2)) {
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

export const calcPickerCoords = (pageX, pageY, circle, dx, dy, radius, rotation) => {
  const { x: offsetX, y: offsetY } = calcWindowOffset(circle.current);
  let x = Math.abs(offsetX - pageX);
  let y = Math.abs(offsetY - pageY);

  if (!isPickerInside(dx, dy, radius)) {
    x = radius + radius * Math.cos(rotation);
    y = radius + radius * Math.sin(rotation);
  }

  return { x, y };
};

export const calcPickerCoordsFromColor = color => {
  const hue = color[0];
  const saturation = color[1];

  // TODO: add calculation
  return {x: 100, y: 100}
}
