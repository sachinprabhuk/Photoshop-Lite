this.onmessage = function({data: { imgData }}) {
  const pixels = imgData.data;
  const grayImgData = new ImageData(
    new Uint8ClampedArray(imgData.data),
    imgData.width,
    imgData.height
  );
  const grayPixels = grayImgData.data;
  for(let i=0;i<pixels.length;i+=4)
    grayPixels[i] = grayPixels[i+1] = grayPixels[i+2] = (
      pixels[i]*0.3 + pixels[i+1]*0.59 + pixels[i+2]*0.11
    );
  this.postMessage(grayImgData);
}