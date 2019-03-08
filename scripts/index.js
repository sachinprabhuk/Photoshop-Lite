if(navigator.serviceWorker) {
  navigator
    .serviceWorker
    .register("/serviceWorker.js")
    .then(reg =>{
      console.log("This app is powered by service workers!");
    })
    .catch(err => {
      console.warn("Something went wrong with service workers!");
    });
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// These variables are most important global vars
let imgPos = null;
let imageData = null;
let lastUsedElement = null;
////////////////////////////////

const controls = {
  basic: {
    brightSlider: document.querySelector("input#bright"),
    blurSlider: document.querySelector("input#_blur"),
    invert: document.querySelector("input#invert")
  },
  edgeDetection: {
    sobelH: document.querySelector("input#sobelH"),
    sobelV: document.querySelector("input#sobelV"),
    prewittH: document.querySelector("input#prewittH"),
    prewittV: document.querySelector("input#prewittV"),
  },
  filters: {
    grayScale: document.querySelector("input#toGray")
  }
}

HTMLInputElement.prototype.reset = function(){this.checked = false;}
HTMLInputElement.prototype.activate = function(){this.disabled = false;}

controls.basic.brightSlider.reset = function() {this.value = 0;}
controls.basic.brightSlider.activate = function() {
  this.disabled = false;
  this.classList.remove("disabled");
}

controls.basic.blurSlider.reset = function() {this.value = this.min;}
controls.basic.blurSlider.activate = function() {
  this.disabled = false;
  this.classList.remove("disabled");
}

// default reset and acivate for all edge detection elements

// default reset and acivate for grayscale



/////////////////////////////////

function reset() {
  for(let IPtype in controls)
    for(let operation in controls[IPtype])
      controls[IPtype][operation].reset();
}

function activate() {
  saveNProceed.disabled = false;
  for(let IPtype in controls)
    for(let operation in controls[IPtype])
      controls[IPtype][operation].activate();
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