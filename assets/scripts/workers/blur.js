const getPixelPos = (x, y, width) => {
  return (y*width + x)*4;
}

this.onmessage = function({ data: { imgData, size } }) {
  const { width, height } = imgData;
  const newImgData = new ImageData(
    new Uint8ClampedArray(imgData.data),
    width, height
  );
  
  const pixels = newImgData.data;
  const originalPixels = imgData.data;
  const s = size >> 1;
  let i, _r, _g, _b;

  for(let row=s;row<(height-s);++row) {
    for(let col=s;col<(width-s);++col) {
      i = getPixelPos(col, row, width);

      _r = 0;_g = 0;_b = 0;
      for(let r=row-s, m = 0;r<=(row+s);++r, ++m)
        for(let c=col-s, n = 0;c<=(col+s);++c, ++n) {
          temp = getPixelPos(c, r, width);
          _r += originalPixels[temp];
          _g += originalPixels[temp+1];
          _b += originalPixels[temp+2];
        }
      
      pixels[i] = _r/(size*size);
      pixels[i+1] = _g/(size*size);
      pixels[i+2] = _b/(size*size);
    }
  }
  this.postMessage(newImgData);
}