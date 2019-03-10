this.onmessage = function({ data: { imgData, offset } }) {
  const pixels = imgData.data;
  const len = pixels.length;
  for (let i = 0; i < len; i += 4) {
    pixels[i] = pixels[i+offset]
    pixels[i + 1] = pixels[i+offset];
    pixels[i + 2] = pixels[i+offset];
  }
  this.postMessage(imgData);
};
