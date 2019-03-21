const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

// These variables are most important global vars
let imgPos = null;
let imageData = null;
let lastUsedElement = null;
////////////////////////////////

const edgeWorker = new Worker("/assets/scripts/workers/edge.js");
const allowPlaneWorker = new Worker("/assets/scripts/workers/allowOnly.js");
const morphoWorker =  new Worker("/assets/scripts/workers/morpho.js")

const controls = {
  basic: {
    brightSlider: {
      node: document.querySelector("input#bright"),
      worker: new Worker("/assets/scripts/workers/brightness.js")
    },
    blurSlider: {
      node: document.querySelector("input#_blur"),
      worker: new Worker("/assets/scripts/workers/blur.js")
    },
    contrast: {
      node: document.querySelector("input#contrast"),
      worker: new Worker("/assets/scripts/workers/contrast.js")
    }
  },
  edgeDetection: {
    sobelH: {
      node: document.querySelector("input#sobelH")
    },
    sobelV: {
      node: document.querySelector("input#sobelV")
    },
    prewittH: {
      node: document.querySelector("input#prewittH")
    },
    prewittV: {
      node: document.querySelector("input#prewittV")
    }
  },
  filters: {
    grayScale: {
      node: document.querySelector("input#toGray"),
      worker: new Worker("/assets/scripts/workers/toGray.js")
    },
    invert: {
      node: document.querySelector("input#invert"),
      worker: new Worker("/assets/scripts/workers/invert.js")
    },
    allowR: {
      node: document.querySelector("input#allowR")
    },
    allowG: {
      node: document.querySelector("input#allowG")
    },
    allowB: {
      node: document.querySelector("input#allowB")
    }
  },
  segmentation: {
    thresholding: {
      node: document.querySelector("input[type=checkbox]#thresh"),
      worker: new Worker("/assets/scripts/workers/toBinaryImage.js")
    }
  },
  morphological: {
    erosion: {
      node: document.querySelector("input#erosion"),
    },
    dilation: {
      node: document.querySelector("input#dilation"),
    },
    b_extration: {
      node: document.querySelector("input#b_extraction") 
    }
  }
};

HTMLInputElement.prototype.reset = function() {
  this.checked = false;
};
HTMLInputElement.prototype.activate = function() {
  this.disabled = false;
};

const threshInput = document.querySelector("form#thresholding input");
const threshBtn = document.querySelector("form#thresholding button");
const threshForm = document.querySelector("form#thresholding");

controls.segmentation.thresholding.node.reset = function() {
  threshInput.value = 127;
  this.checked = false;
  threshBtn.disabled = true;
  threshInput.disabled = true;
};
controls.segmentation.thresholding.node.activate = function() {
  this.disabled = false;
};

function genericActivate() {
  this.disabled = false;
  this.classList.remove("disabled");
}
function genericReset() {
  this.value = this.min || 0;
}

controls.basic.brightSlider.node.reset = function() {
  this.value = 0;
};
controls.basic.brightSlider.node.activate = genericActivate;

controls.basic.contrast.node.reset = genericReset;
controls.basic.contrast.node.activate = genericActivate

controls.basic.blurSlider.node.reset = genericReset;
controls.basic.blurSlider.node.activate = genericActivate;

controls.morphological.erosion.node.reset = genericReset;
controls.morphological.dilation.node.reset = genericReset;
controls.morphological.erosion.node.activate = genericActivate;
controls.morphological.dilation.node.activate = genericActivate;
controls.morphological.b_extration.node.activate = genericActivate;
controls.morphological.b_extration.node.reset = genericReset;

// default reset and acivate for all edge detection elements

// default reset and acivate for grayscale

/////////////////////////////////

function reset() {
  for (let IPtype in controls)
    for (let operation in controls[IPtype])
      controls[IPtype][operation].node.reset();
}

const saveNProceed = document.querySelector("button#save");
const downloadBtn = document.querySelector("button#download");

function activate() {
  saveNProceed.disabled = false;
  downloadBtn.disabled = false;  
  for (let IPtype in controls)
    for (let operation in controls[IPtype])
      controls[IPtype][operation].node.activate();
}


function download() {
  const link = document.createElement("a");
  const newCanvas = document.createElement("canvas");
  newCanvas.width = imageData.width;
  newCanvas.height = imageData.height;
  newCanvas
    .getContext("2d")
    .putImageData(
      ctx.getImageData(
        imgPos.x, imgPos.y, 
        imageData.width, imageData.height
      ), 0, 0
    );
  link.download = "Photo-lite.png";
  link.href = newCanvas.toDataURL();
  link.click();
}

/*
const sobelHkernel = [
  [1, 1, 2, 1, 1], [1, 2, 2, 2, 1], [0, 0, 0, 0, 0],
  [-1, -2, -2, -2, -1], [-1, -1, -2, -1, -1]
];
const sobelVkernel = [
  [1, 1, 0, -1, -1], [1, 2, 0, -2, -1], [2, 2, 0, -2, -2],
  [1, 2, 0, -2, -1], [1, 1, 0, -1, -1]
];
const prewittHkernel = [
  [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [0, 0, 0, 0, 0],
  [-1, -1, -1, -1, -1], [-1, -1, -1, -1, -1]
];
const prewittVkernel = [
  [1, 1, 0, -1, -1], [1, 1, 0, -1, -1], [1, 1, 0, -1, -1],
  [1, 1, 0, -1, -1], [1, 1, 0, -1, -1]
];
*/
