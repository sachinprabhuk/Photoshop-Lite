this.onmessage = function({ data: { imgData, bright } }) {
  const pixels = imgData.data;
  const { min } = Math;
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] += min(bright, 255-pixels[i]);
    pixels[i+1] += min(bright, 255-pixels[i+1]);
    pixels[i+2] += min(bright, 255-pixels[i+2]);
  }
  this.postMessage(imgData);
};
