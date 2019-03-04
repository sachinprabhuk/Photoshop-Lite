const getPixelPos = (x, y, width) => {
  return (y*width + x)*4;
}

this.onmessage = function({ data: { imgData, kernel } }) {
  const { width, height } = imgData;
  const newImgData = new ImageData(
    new Uint8ClampedArray(imgData.data),
    width, height
  );
  
  const pixels = newImgData.data;
  const originalPixels = imgData.data;
  const klen = kernel[0].length;
  const s = klen >> 1;
  let i, _r, _g, _b;

  for(let row=s;row<(height-s);++row) {
    for(let col=s;col<(width-s);++col) {
      i = getPixelPos(col, row, width);

      _r = 0;_g = 0;_b = 0;
      for(let r=row-s, m = 0;r<=(row+s);++r, ++m)
        for(let c=col-s, n = 0;c<=(col+s);++c, ++n) {
          temp = getPixelPos(c, r, width);
          _r += (kernel[m][n]*originalPixels[temp]);
          _g += (kernel[m][n]*originalPixels[temp+1]);
          _b += (kernel[m][n]*originalPixels[temp+2]);
        }
      
      pixels[i] = _r/(klen**2);
      pixels[i+1] = _g/(klen**2);
      pixels[i+2] = _b/(klen**2);
      // pixels[i+3] = 255;
    }
  }

  this.postMessage(newImgData);
}