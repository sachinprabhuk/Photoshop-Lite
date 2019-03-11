this.onmessage = function({ data: { imgData, contrast } }) {
  const pixels = imgData.data;
  const len = pixels.length;
  contrast = contrast / 100 + 1;
  const intercept = 128 * (1 - contrast);
  for (let i = 0; i < len; i += 4) {
    pixels[i] = pixels[i] * contrast + intercept;
    pixels[i + 1] = pixels[i + 1] * contrast + intercept;
    pixels[i + 2] = pixels[i + 2] * contrast + intercept;
  }
  this.postMessage(imgData);
};
