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
  let i, sum, avg;

  for(let row=s;row<(height-s);++row) {
    for(let col=s;col<(width-s);++col) {
      i = getPixelPos(col, row, width);

      sum = 0;
      for(let r=row-s, m = 0;r<=(row+s);++r, ++m)
        for(let c=col-s, n = 0;c<=(col+s);++c, ++n) {
          temp = getPixelPos(c, r, width);
          // console.log(r, c, m , n);
          avg = (
            originalPixels[temp] + originalPixels[temp+1]
             + originalPixels[temp+2]
            )/3;
          sum += (avg*kernel[m][n]);
        }
      
      pixels[i] = sum/9;
      pixels[i+1] = sum/9;
      pixels[i+2] = sum/9;
    }
  }

  this.postMessage(newImgData);
}