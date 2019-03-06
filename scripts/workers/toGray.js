this.onmessage = function({ data: { imgData } }) {
  const pixels = imgData.data;
  const len = pixels.length;
  let temp;
  for(let i=0;i<len;i+=4) {
    temp = (pixels[i] + pixels[i+1] + pixels[i+2])/3
    pixels[i] = pixels[i+1] = pixels[i+2] = temp;
  }
  this.postMessage(imgData);
}