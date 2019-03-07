/*
  Brightness slider listener
*/

controls.basic.brightSlider.addEventListener("mouseup", function(e) {
  lastUsedElement && lastUsedElement!=e.target && lastUsedElement.reset();
  lastUsedElement = this;
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

/*
  upload pic button listener
*/

const uploadButton = document.querySelector("input#upload");
uploadButton.addEventListener("change", e => {
  const reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.onload = function({ target: { result } }) {
    const img = new Image();
    img.onload = function() {
      activate();
      reset();
      imageUploaded = true;
      imgPos = {
        x: (canvas.width - this.width) >> 1,
        y: (canvas.height - this.height) >> 1
      };
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(this, imgPos.x, imgPos.y);
      imageData = ctx.getImageData(
        imgPos.x, imgPos.y, 
        this.width, this.height
      );
    }
    img.src = result;
  } 
});

/*
  blur slider listener
*/

controls.basic.blurSlider.addEventListener("mouseup", function(e) {
  lastUsedElement && lastUsedElement!==this && lastUsedElement.reset();
  lastUsedElement = this;
  let blurVal = this.value;
  if(blurVal == 3) {
    ctx.putImageData(imageData, imgPos.x, imgPos.y);
    return;
  }

  blurVal -= 2;
  const worker = new Worker("/scripts/workers/mask.js");
  worker.onmessage = function({ data }) {
    ctx.putImageData(data, imgPos.x, imgPos.y);
    worker.terminate();
  }
  worker.postMessage({
    imgData: imageData,
    kernel: Array(blurVal).fill(Array(blurVal).fill(1))
  });
});

/*
  save button listener
*/

const saveNProceed = document.querySelector("button#save");
saveNProceed.addEventListener("click", e => {
  imageData = ctx.getImageData(
    imgPos.x, imgPos.y, 
    imageData.width, imageData.height
  );
  reset();
  new Toast("Image saved!! Continue editing.", 3000);
});

/*  
  to gray scale checkbox listener.
*/

controls.filters.grayScale.addEventListener("click", function(e) {
  lastUsedElement && lastUsedElement !== this && lastUsedElement.reset();
  lastUsedElement = this;
  if(this.checked) {
    const worker = new Worker("/scripts/workers/toGray.js");
    worker.onmessage = function({ data }) {
      ctx.putImageData(data, imgPos.x, imgPos.y);
      worker.terminate();
    }
    worker.postMessage({ imgData: imageData });
  }
  else
    ctx.putImageData(imageData, imgPos.x, imgPos.y);    
});

/*
  edge detection prewitt
*/

const edgeDetection = (node, kernel) => {
  lastUsedElement && lastUsedElement !== node && lastUsedElement.reset();
  lastUsedElement = node;
  if(node.checked) {
    const worker = new Worker("/scripts/workers/edge.js");
    worker.onmessage = function({ data }) {
      ctx.putImageData(data, imgPos.x, imgPos.y);
      worker.terminate();
    }
    worker.postMessage({
      imgData: imageData,
      kernel
    });    
  }
  else
    ctx.putImageData(imageData, imgPos.x, imgPos.y); 
}

controls.edgeDetection.sobelH.addEventListener("click", function() {
  edgeDetection(this, [
    [1, 2, 1], [0, 0, 0], [-1, -2, -1]
  ]);
});
controls.edgeDetection.sobelV.addEventListener("click", function() {
  edgeDetection(this, [
    [1, 0, -1], [2, 0, -2], [1, 0, -1]
  ]);
});
controls.edgeDetection.prewittH.addEventListener("click", function() {
  edgeDetection(this, [
    [1, 1, 1], [0, 0, 0], [-1, -1, -1]
  ]);
});
controls.edgeDetection.prewittV.addEventListener("click", function() {
  edgeDetection(this, [
    [1, 0, -1], [1, 0, -1], [1, 0, -1]
  ]);
});

