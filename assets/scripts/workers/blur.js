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
  let i, _r, _g, _b, copyRow, copyCol;

  for(let row=0;row<(height);++row) {
    for(let col=0;col<(width);++col) {
      i = getPixelPos(col, row, width);

      _r = 0;_g = 0;_b = 0;
      for(let r=row-s, m = 0;r<=(row+s);++r, ++m)
        for(let c=col-s, n = 0;c<=(col+s);++c, ++n) {
          copyRow = r;
          copyCol = c;
          if(copyRow < 0) copyRow = 0;
          if(copyCol < 0) copyCol = 0;
          if(copyRow > (height-1)) copyRow = height-1;
          if(copyCol > (width-1)) copyCol = width-1;
          temp = getPixelPos(copyCol, copyRow, width);
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