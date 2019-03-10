this.onmessage = function({ data: { imgData, threshold } }) {
  const pixels = imgData.data;
  const len = pixels.length;
  let avg;
  for (let i = 0; i < len; i += 4) {
    avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = avg >= threshold ? 0 : 255;
  }
  this.postMessage(imgData);
};
