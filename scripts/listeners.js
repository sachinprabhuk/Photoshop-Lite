const brightSlider = document.querySelector("input[type='range']#bright");

brightSlider.addEventListener("mouseup", e => {
  const worker = new Worker("/scripts/workers/brightness.js");
  console.log("hye")
  worker.onmessage = function({ data }) {
    ctx.putImageData(data, imgPos.x, imgPos.y);
    worker.terminate();
  }
  worker.postMessage({
    imgData: imageData,
    bright: e.target.value
  });

});

///////////////////////////////////////////////////////////

const uploadButton = document.querySelector("input#upload");
uploadButton.addEventListener("change", e => {
  const reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.onload = function({ target: { result } }) {
    const img = new Image();
    img.onload = () => {
      imgPos = {
        x: (canvas.width - img.width) >> 1,
        y: (canvas.height - img.height) >> 1
      };
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, imgPos.x, imgPos.y);
      imageData = ctx.getImageData(imgPos.x, imgPos.y, img.width, img.height);
    }
    img.src = result;
  } 
});

////////////////////////////////////////////