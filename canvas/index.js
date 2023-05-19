const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const lineWidth = document.querySelector('#line-width');
const fontWidth = document.querySelector('#font-width');
const color = document.querySelector('#color');
const colorOptions = document.querySelector('.color-area');
const btnMode = document.querySelector('#btn-mode');
const btnDestroy = document.querySelector('#btn-destroy');
const btnEraser = document.querySelector('#btn-eraser');
const textInput = document.querySelector('#font-text');
const fileInput = document.querySelector('#lb-file');
const saveBtn = document.querySelector('#btn-save');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

ctx.lineWidth = lineWidth.value;
ctx.fontSize = fontWidth.value;

let isPainting = false;
let isFilling = false;

function onMove(e) {
  if (isPainting) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    return;
  }

  ctx.moveTo(e.offsetX, e.offsetY);
}

function onDown() {
  isPainting = true;
}

function onUp() {
  isPainting = false;
  ctx.beginPath();
}
function onChange(e) {
  ctx.lineWidth = e.target.value;
}
function onFontChange(e) {
  console.log(e.target.value);
  ctx.fontSize = e.target.value;
}
function onColorChange(e) {
  ctx.strokeStyle = e.target.value;
  ctx.fillStyle = e.target.value;
}
function onColorClick(e) {
  ctx.strokeStyle = e.target.dataset.color;
  ctx.fillStyle = e.target.dataset.color;
  color.value = e.target.dataset.color;
}

function onModeBtn() {
  if (isFilling) {
    isFilling = false;
    btnMode.innerText = 'Fill';
  } else {
    isFilling = true;
    btnMode.innerText = 'Draw';
  }
}
function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}
function onDoubleClick(e) {
  const text = textInput.value;

  if (text !== '') {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = `${ctx.fontSize}px serif`;
    ctx.fillText(text, e.offsetX, e.offsetY);
    ctx.restore();
  }
}
function onDestoryClick() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function onEraserClick() {
  ctx.strokeStyle = 'white';
  isFilling = false;
  btnMode.innerText = 'Fill';
}
function onFileChange(e) {
  const file = e.target.files[0];
  const url = URL.createObjectURL(file);
  console.log(url);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
}

function onSaveClick(e) {
  const url = canvas.toDataURL();
  const a = document.createElement('a');
  a.href = url;
  a.download = 'myDrawing.png';
  a.click();
}
canvas.addEventListener('dblclick', onDoubleClick);
canvas.addEventListener('mousemove', onMove);
canvas.addEventListener('mousedown', onDown);
document.addEventListener('mouseup', onUp);
// canvas.addEventListener('mouseleave', onUp);
canvas.addEventListener('click', onCanvasClick);
lineWidth.addEventListener('change', onChange);
fontWidth.addEventListener('change', onFontChange);
color.addEventListener('change', onColorChange);
colorOptions.addEventListener('click', onColorClick);
btnMode.addEventListener('click', onModeBtn);
btnDestroy.addEventListener('click', onDestoryClick);
btnEraser.addEventListener('click', onEraserClick);
fileInput.addEventListener('change', onFileChange);
saveBtn.addEventListener('click', onSaveClick);
