this.onmessage = function({data: { imgData }}) {
  const pixels = imgData.data;
  for(let i=0;i<pixels.length;i+=4)
    pixels[i] = pixels[i+1] = pixels[i+2] = (
      pixels[i]*0.3 + pixels[i+1]*0.59 + pixels[i+2]*0.11
    );
  this.postMessage(imgData);
}