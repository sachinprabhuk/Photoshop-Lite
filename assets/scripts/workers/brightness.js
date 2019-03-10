function rgb2hsv(r, g, b) {
  let computedH = 0;
  let computedS = 0;
  let computedV = 0;
  r /= 255;
  g /= 255;
  b /= 255;
  const minRGB = Math.min(r, Math.min(g, b));
  const maxRGB = Math.max(r, Math.max(g, b));
  if (minRGB == maxRGB) {
    computedV = minRGB;
    return [0, 0, computedV];
  }
  let d = r == minRGB ? g - b : b == minRGB ? r - g : b - r;
  let h = r == minRGB ? 3 : b == minRGB ? 1 : 5;
  computedH = 60 * (h - d / (maxRGB - minRGB));
  computedS = (maxRGB - minRGB) / maxRGB;
  computedV = maxRGB;
  return [computedH, computedS * 100, computedV * 100];
}

function hsv2rgb(h, s, v) {
  var r, g, b;
  var i;
  var f, p, q, t;

  h = Math.max(0, Math.min(360, h));
  s = Math.max(0, Math.min(100, s));
  v = Math.max(0, Math.min(100, v));

  s /= 100;
  v /= 100;

  if (s == 0) {
    r = g = b = v;
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  h /= 60; // sector 0 to 5
  i = Math.floor(h);
  f = h - i; // factorial part of h
  p = v * (1 - s);
  q = v * (1 - s * f);
  t = v * (1 - s * (1 - f));

  switch (i) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;

    case 1:
      r = q;
      g = v;
      b = p;
      break;

    case 2:
      r = p;
      g = v;
      b = t;
      break;

    case 3:
      r = p;
      g = q;
      b = v;
      break;

    case 4:
      r = t;
      g = p;
      b = v;
      break;

    default:
      // case 5:
      r = v;
      g = p;
      b = q;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

this.onmessage = function({ data: { imgData, bright } }) {
  const newImgData = new ImageData(
    new Uint8ClampedArray(imgData.data),
    imgData.width,
    imgData.height
  );
  const pixels = imgData.data;
  const newPixels = newImgData.data;
  let h, s, v;
  for (let i = 0; i < pixels.length; i += 4) {
    [h, s, v] = rgb2hsv(pixels[i], pixels[i + 1], pixels[i + 2]);
    v += Math.min(bright, 100 - v);
    [newPixels[i], newPixels[i + 1], newPixels[i + 2]] = hsv2rgb(h, s, v);
  }
  this.postMessage(newImgData);
};
