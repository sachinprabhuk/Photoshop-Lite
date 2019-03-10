const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// These variables are most important global vars
let imgPos = null;
let imageData = null;
let lastUsedElement = null;
////////////////////////////////

const edgeWorker = new Worker("/assets/scripts/workers/edge.js");
const controls = {
  basic: {
    brightSlider: {
      node: document.querySelector("input#bright"), 
      worker: new Worker("/assets/scripts/workers/brightness.js")
    },
    blurSlider: { 
      node: document.querySelector("input#_blur"), 
      worker: new Worker("/assets/scripts/workers/blur.js")
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
    }
  }
}

HTMLInputElement.prototype.reset = function(){this.checked = false;}
HTMLInputElement.prototype.activate = function(){this.disabled = false;}

controls.basic.brightSlider.node.reset = function() {this.value = 0;}
controls.basic.brightSlider.node.activate = function() {
  this.disabled = false;
  this.classList.remove("disabled");
}

controls.basic.blurSlider.node.reset = function() {this.value = this.min;}
controls.basic.blurSlider.node.activate = function() {
  this.disabled = false;
  this.classList.remove("disabled");
}

// default reset and acivate for all edge detection elements

// default reset and acivate for grayscale



/////////////////////////////////

function reset() {
  for(let IPtype in controls)
    for(let operation in controls[IPtype])
      controls[IPtype][operation].node.reset();
}

function activate() {
  saveNProceed.disabled = false;
  for(let IPtype in controls)
    for(let operation in controls[IPtype])
      controls[IPtype][operation].node.activate();
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