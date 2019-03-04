const brightSlider = document.querySelector("input[type='range']#bright");

brightSlider.addEventListener("mouseup", e => {
  const worker = new Worker("/scripts/workers/brightness.js");
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
      reset();
      imageUploaded = true;
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

const blurSlider = document.querySelector("input#_blur");
blurSlider.addEventListener("mouseup", e => {
  let blurVal = e.target.value;
  if(blurVal == 3) {
    ctx.putImageData(imageData, imgPos.x, imgPos.y);
    return;
  }

  blurVal -= 2;
  const kernel = Array(blurVal).fill(Array(blurVal).fill(1));
  const worker = new Worker("/scripts/workers/mask.js");
  worker.onmessage = function({ data }) {
    ctx.putImageData(data, imgPos.x, imgPos.y);
    worker.terminate();
  }
  worker.postMessage({
    imgData: imageData,
    kernel
  })
});

/////////////////////////////////


function reset() {
  blurSlider.value = blurSlider.min;
  brightSlider.value = 0;
}