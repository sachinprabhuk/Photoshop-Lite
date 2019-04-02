/*
  Brightness slider listener
*/

controls.basic.brightSlider.node.addEventListener("change", function(e) {
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
  contrast slider
*/

controls.basic.contrast.node.addEventListener("change", function(e) {
  lastUsedElement && lastUsedElement != e.target && lastUsedElement.reset();
  lastUsedElement = this;
  const { worker } = controls.basic.contrast;
  worker.onmessage = function({ data }) {
    ctx.putImageData(data, imgPos.x, imgPos.y);
  };
  worker.postMessage({
    imgData: imageData,
    contrast: this.value
  });
});

/*
  upload pic button listener
*/

const getDimensions = image => {
  const { width, height } = image;
  let x = 0, y = 0, w = width, h = height;
  const aspectRatio = w/h;
  if(w >= canvas.width)
    w = canvas.width, h = w/aspectRatio;
  if(h >= canvas.height)
    h = canvas.height, w = h*aspectRatio;

  x = (canvas.width-w) >> 1;
  y = (canvas.height-h) >> 1;	

  return {x, y, w, h};
}

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
      const { w, h, x, y } = getDimensions(this);
      imgPos = { x, y };
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(this, x, y, w, h);
      imageData = ctx.getImageData(x, y, w, h);
      downloadBtn.querySelector("img").src = "/assets/photos/d1.png";
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

controls.basic.blurSlider.node.addEventListener("change", function(e) {
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
  worker.postMessage({ imgData: imageData, size: blurVal });
});

/*
  save button listener
*/

saveNProceed.addEventListener("click", e => {
  imageData = ctx.getImageData(
    imgPos.x,
    imgPos.y,
    imageData.width,
    imageData.height
  );
  reset();
  new Toast("Effect saved!! Continue editing.", 3000);
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

/*
  segmentation
*/

controls.segmentation.thresholding.node.addEventListener("click", function(e) {
  lastUsedElement && lastUsedElement !== this && lastUsedElement.reset();
  lastUsedElement = this;
  ctx.putImageData(imageData, imgPos.x, imgPos.y);
  if (this.checked) {
    threshBtn.disabled = false;
    threshInput.disabled = false;
  } else {
    threshBtn.disabled = true;
    threshInput.disabled = true;
  }
});

threshForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const { worker } = controls.segmentation.thresholding;
  worker.onmessage = function({ data }) {
    ctx.putImageData(data, imgPos.x, imgPos.y);
  };
  worker.postMessage({
    imgData: imageData,
    threshold: Number.parseInt(threshInput.value)
  });
});

/*
  Morphological
*/

function morpho() {
  lastUsedElement && lastUsedElement !== this && lastUsedElement.reset();
  lastUsedElement = this;

  if(this.value == 0) {
    ctx.putImageData(imageData, imgPos.x, imgPos.y);
    return;
  }
  const seSize = 2*this.value + 1;
  morphoWorker.onmessage = function({ data }) {
    ctx.putImageData(data, imgPos.x, imgPos.y);
  }

  morphoWorker.postMessage({
    imgData: imageData,
    size: seSize,
    op: this.getAttribute("id")
  });
}

controls.morphological.erosion.node.addEventListener("change", morpho);

controls.morphological.dilation.node.addEventListener("change", morpho);

controls.morphological.b_extration.node.addEventListener("change", morpho);
