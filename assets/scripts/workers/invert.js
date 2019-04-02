this.onmessage = function({data: { imgData }}) {
  const pixels = imgData.data;
  for(let i=0;i<pixels.length;i+=4) {
    pixels[i] = 255 - pixels[i];
    pixels[i+1] = 255 - pixels[i+1];
    pixels[i+2] = 255 - pixels[i+2];
  }
  this.postMessage(imgData);
}