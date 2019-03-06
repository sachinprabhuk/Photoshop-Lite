controls.basic.brightSlider.addEventListener("mouseup", e => {
  lastUsedElement && lastUsedElement!=e.target && lastUsedElement.reset();
  lastUsedElement = e.target;
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
      activate();
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

controls.basic.blurSlider.addEventListener("mouseup", e => {
  lastUsedElement && lastUsedElement!=e.target && lastUsedElement.reset();
  lastUsedElement = e.target;
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

////////////////////////////////////////////////////

const saveNProceed = document.querySelector("button#save");
saveNProceed.addEventListener("click", e => {
  imageData = ctx.getImageData(
    imgPos.x, imgPos.y, 
    imageData.width, imageData.height
  );
  reset();
  new Toast("Image saved!! Continue editing.", 3000);
})


///////////////////////////////////////////////////////

// const edgeSobel = document.querySelector("input#sobel");
// const sobelFn = (() => {
//   let active = false;
//   return () => {
//     if(active) {
//       ctx.putImageData(imageData, imgPos.x, imgPos.y); 
//       active = false;
//     }
//     else {
//       const worker = new Worker("/scripts/workers/edge.js");
//       worker.onmessage = function({ data }) {
//         ctx.putImageData(data, imgPos.x, imgPos.y);
//       }
//       worker.postMessage({
//         imgData: imageData,
//         kernel: [
//           [1, 0, 1],
//           [1, 0, 1],
//           [1, 0, 1]
//         ]
//       });
//       active = true;
//     }
//   }
// })();
// edgeSobel.addEventListener("click", sobelFn);


////////////////////////////////////////////
const toGrayFn = (() => {
  
  let active = false;
  return e => {
    lastUsedElement && lastUsedElement!=e.target && lastUsedElement.reset();
    lastUsedElement = e.target;
    console.log(e.target);
    if(active) {
      ctx.putImageData(imageData, imgPos.x, imgPos.y);
      active = false;
    }
    else {
      const worker = new Worker("/scripts/workers/toGray.js");
      worker.onmessage = function({ data }) {
        ctx.putImageData(data, imgPos.x, imgPos.y);
        worker.terminate();
      }
      worker.postMessage({
        imgData: imageData
      });
      active = true;
    }
  }
})();


controls.basic.grayCheck.addEventListener("click", toGrayFn);
