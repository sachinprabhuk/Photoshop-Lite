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
    grayCheck: document.querySelector("input#toGray")
  }
}

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

controls.basic.grayCheck.reset = function() {this.checked = false;}
controls.basic.grayCheck.activate = function() {this.disabled = false;}

/////////////////////////////////

function reset() {
  for(let keys in controls.basic)
    controls.basic[keys].reset();
}

function activate() {
  saveNProceed.disabled = false;
  for(let keys in controls.basic)
    controls.basic[keys].activate();
}