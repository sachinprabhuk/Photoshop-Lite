/*
  Brightness slider listener
*/

controls.basic.brightSlider.node.addEventListener("mouseup", function(e) {
  lastUsedElement && lastUsedElement != e.target && lastUsedElement.reset();
  lastUsedElement = this;
  const { worker } = controls.basic.brightSlider;
  worker.onmessage = function({ data }) {
    ctx.putImageData(data, imgPos.x, imgPos.y);
  };
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
  if (e.target.files.length === 0) return;
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
      imageData = ctx.getImageData(imgPos.x, imgPos.y, this.width, this.height);
    };
    img.src = result;
  };
});

/*
  Invert color listener
*/

controls.filters.invert.node.addEventListener("click", function(e) {
  lastUsedElement && lastUsedElement !== this && lastUsedElement.reset();
  lastUsedElement = this;
  if (this.checked) {
    const { worker } = controls.filters.invert;
    worker.onmessage = function({ data }) {
      ctx.putImageData(data, imgPos.x, imgPos.y);
    };
    worker.postMessage({ imgData: imageData });
  } else ctx.putImageData(imageData, imgPos.x, imgPos.y);
});

/*
  blur slider listener
*/

controls.basic.blurSlider.node.addEventListener("mouseup", function(e) {
  lastUsedElement && lastUsedElement !== this && lastUsedElement.reset();
  lastUsedElement = this;
  let blurVal = this.value;
  if (blurVal == 3) {
    ctx.putImageData(imageData, imgPos.x, imgPos.y);
    return;
  }

  blurVal -= 2;
  const { worker } = controls.basic.blurSlider;
  worker.onmessage = function({ data }) {
    ctx.putImageData(data, imgPos.x, imgPos.y);
  };
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
    imgPos.x,
    imgPos.y,
    imageData.width,
    imageData.height
  );
  reset();
  new Toast("Image saved!! Continue editing.", 3000);
});

/*  
  to gray scale checkbox listener.
*/

controls.filters.grayScale.node.addEventListener("click", function(e) {
  lastUsedElement && lastUsedElement !== this && lastUsedElement.reset();
  lastUsedElement = this;
  if (this.checked) {
    const { worker } = controls.filters.grayScale;
    worker.onmessage = function({ data }) {
      ctx.putImageData(data, imgPos.x, imgPos.y);
    };
    worker.postMessage({ imgData: imageData });
  } else ctx.putImageData(imageData, imgPos.x, imgPos.y);
});

/*
  edge detection prewitt
*/

const edgeDetection = (node, kernel) => {
  lastUsedElement && lastUsedElement !== node && lastUsedElement.reset();
  lastUsedElement = node;
  if (node.checked) {
    const worker = edgeWorker;
    worker.onmessage = function({ data }) {
      ctx.putImageData(data, imgPos.x, imgPos.y);
    };
    worker.postMessage({
      imgData: imageData,
      kernel
    });
  } else ctx.putImageData(imageData, imgPos.x, imgPos.y);
};

controls.edgeDetection.sobelH.node.addEventListener("click", function() {
  edgeDetection(this, [[1, 2, 1], [0, 0, 0], [-1, -2, -1]]);
});
controls.edgeDetection.sobelV.node.addEventListener("click", function() {
  edgeDetection(this, [[1, 0, -1], [2, 0, -2], [1, 0, -1]]);
});
controls.edgeDetection.prewittH.node.addEventListener("click", function() {
  edgeDetection(this, [[1, 1, 1], [0, 0, 0], [-1, -1, -1]]);
});
controls.edgeDetection.prewittV.node.addEventListener("click", function() {
  edgeDetection(this, [[1, 0, -1], [1, 0, -1], [1, 0, -1]]);
});

/*
  allow rgb plane
*/

const allowPlane = (node, offset) => {
  lastUsedElement && lastUsedElement !== node && lastUsedElement.reset();
  lastUsedElement = node;
  const worker = allowPlaneWorker;
  worker.onmessage = function({ data }) {
    ctx.putImageData(data, imgPos.x, imgPos.y);
  };
  worker.postMessage({
    imgData: imageData,
    offset
  });
};

controls.filters.allowR.node.addEventListener("click", function(e) {
  if (this.checked) allowPlane(this, 0);
  else ctx.putImageData(imageData, imgPos.x, imgPos.y);
});
controls.filters.allowG.node.addEventListener("click", function(e) {
  if (this.checked) allowPlane(this, 1);
  else ctx.putImageData(imageData, imgPos.x, imgPos.y);
});
controls.filters.allowB.node.addEventListener("click", function(e) {
  if (this.checked) allowPlane(this, 2);
  else ctx.putImageData(imageData, imgPos.x, imgPos.y);
});
