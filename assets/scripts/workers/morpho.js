const getPixelPos = (row, col, width) => {
  return (row * width + col) * 4;
};

const getSE = size => {
  let arr = [];
  let rows = new Array(size);
  rows.fill(1);
  for (let i = 0; i < size; ++i) arr.push(rows);
  return arr;
};

const erosionVal = (pixels, sx, sy, se, seSize, width) => {
  let minVal = 256, pp;
  for (let i = 0; i < seSize; ++i)
    for (let j = 0; j < seSize; ++j)
      if (se[i][j] === 1) {
        pp = getPixelPos(sx + i, sy + j, width);
        if (pixels[pp] < minVal) minVal = pixels[pp];
      }
  return minVal;
};
const dilationVal = (pixels, sx, sy, se, seSize, width) => {
  let maxVal = 0, pp;
  for (let i = 0; i < seSize; ++i)
    for (let j = 0; j < seSize; ++j)
      if (se[i][j] === 1) {
        pp = getPixelPos(sx + i, sy + j, width);
        if (pixels[pp] > maxVal) maxVal = pixels[pp];
      }
  return maxVal;
};

this.onmessage = function({ data: { imgData, size, op } }) {
  const { width, height } = imgData;
  const pixels = imgData.data;
  const newImgData = new ImageData(
    new Uint8ClampedArray(pixels),
    width, 
    height
  );
  const newPixels = newImgData.data;
  const s = size >> 1;
  const se = getSE(size);
  let pp;
  if (op === "erosion") {
    for (let row = s; row < height - s; ++row) {
      for (let col = s; col < width - s; ++col) {
        pp = getPixelPos(row, col, width);
        newPixels[pp] = newPixels[pp + 1] = newPixels[pp + 2] =
          erosionVal(pixels, row - s, col - s, se, size, width);
      }
    }
  }else if(op === "b_extraction") {
    for (let row = s; row < height - s; ++row) {
      for (let col = s; col < width - s; ++col) {
        pp = getPixelPos(row, col, width);
        newPixels[pp] = newPixels[pp + 1] = newPixels[pp + 2] = (
          pixels[pp] 
          - erosionVal(pixels, row - s, col - s, se, size, width)
        )
      }
    }
  }
  else
    for (let row = s; row < height - s; ++row) {
      for (let col = s; col < width - s; ++col) {
        pp = getPixelPos(row, col, width);
        newPixels[pp] = newPixels[pp + 1] = newPixels[pp + 2] =
          dilationVal(pixels, row - s, col - s, se, size, width);
      }
    }
  this.postMessage(newImgData);
};
