class DrawingApp {
  constructor(canvasClass) {
    this.canvasArea = document.querySelector(`.${canvasClass}`);
    this.canvas = this.canvasArea.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.controls = {
      lineWidth: this.canvasArea.querySelector('#line-width'),
      fontSize: this.canvasArea.querySelector('#font-width'),
      text: this.canvasArea.querySelector('#font-text'),
      color: this.canvasArea.querySelector('#color'),
      colorOptions: this.canvasArea.querySelector('.color-area'),
      modeButton: this.canvasArea.querySelector('#btn-mode'),
      eraserButton: this.canvasArea.querySelector('#btn-eraser'),
      destroyButton: this.canvasArea.querySelector('#btn-destroy'),
      fileInput: this.canvasArea.querySelector('#lb-file'),
      saveButton: this.canvasArea.querySelector('#btn-save'),
    };
    this.isPainting = false;
    this.isFilling = false;

    this.isMobile = this.checkMobile();
    this.setupCanvas();
    this.addEventListeners();
  }

  setupCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.ctx.lineWidth = this.controls.lineWidth.value;
    this.ctx.fontSize = this.controls.fontSize.value;
  }
  addEventListeners() {
    window.addEventListener('resize', () => {
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
    });

    this.canvas.addEventListener(
      `${this.isMobile ? 'touchstart' : 'dblclick'}`,
      this.onDoubleClick.bind(this)
    );
    this.canvas.addEventListener(
      `${this.isMobile ? 'touchmove' : 'mousemove'}`,
      this.onMove.bind(this)
    );
    this.canvas.addEventListener('touchmove', (e) => {
      if (this.isPainting) {
        e.preventDefault();
      }
    });
    this.canvas.addEventListener(
      `${this.isMobile ? 'touchstart' : 'mousedown'}`,
      this.onDown.bind(this)
    );
    document.addEventListener(
      `${this.isMobile ? 'touchend' : 'mouseup'}`,
      this.onUp.bind(this)
    );
    this.canvas.addEventListener('click', this.onCanvasClick.bind(this));
    this.controls.lineWidth.addEventListener(
      'change',
      this.onChange.bind(this)
    );
    this.controls.color.addEventListener(
      'change',
      this.onColorChange.bind(this)
    );
    this.controls.colorOptions.addEventListener(
      'click',
      this.onColorClick.bind(this)
    );

    this.controls.modeButton.addEventListener(
      'click',
      this.onModeBtn.bind(this)
    );
    this.controls.destroyButton.addEventListener(
      'click',
      this.onDestoryClick.bind(this)
    );
    this.controls.eraserButton.addEventListener(
      'click',
      this.onEraserClick.bind(this)
    );
    this.controls.fontSize.addEventListener(
      'change',
      this.onFontChange.bind(this)
    );
    this.controls.fileInput.addEventListener(
      'change',
      this.onFileChange.bind(this)
    );
    this.controls.saveButton.addEventListener(
      'click',
      this.onSaveClick.bind(this)
    );
  }

  onMove(e) {
    e.preventDefault();
    if (this.isPainting) {
      const { clientX, clientY } = this.getCoordinates(e);
      this.ctx.lineTo(clientX, clientY);
      this.ctx.stroke();
      return;
    }

    const { clientX, clientY } = this.getCoordinates(e);
    this.ctx.moveTo(clientX, clientY);
  }

  onDown(e) {
    e.preventDefault();
    this.isPainting = true;
    const { clientX, clientY } = this.getCoordinates(e);
    this.ctx.moveTo(clientX, clientY);
  }

  onUp() {
    this.isPainting = false;
    this.ctx.beginPath();
  }

  onChange(e) {
    this.ctx.lineWidth = e.target.value;
  }

  onColorChange(e) {
    const selectedColor = e.target.value;
    this.ctx.strokeStyle = selectedColor;
    this.ctx.fillStyle = selectedColor;
  }

  onColorClick(e) {
    const selectedColor = e.target.dataset.color;
    this.ctx.strokeStyle = selectedColor;
    this.ctx.fillStyle = selectedColor;
    this.controls.color.value = selectedColor;
  }

  onModeBtn() {
    if (this.isFilling) {
      this.isFilling = false;
      this.controls.modeButton.innerText = '✏️ Fill';
    } else {
      this.isFilling = true;
      this.controls.modeButton.innerText = '✏️ Draw';
    }
  }

  onCanvasClick() {
    if (this.isFilling) {
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
  onDoubleClick(e) {
    const text = this.controls.text.value;

    if (text !== '') {
      const { offsetX, offsetY } = this.getCoordinates(e);
      this.ctx.save();
      this.ctx.lineWidth = 1;
      this.ctx.font = `${this.ctx.fontSize}px serif`;
      this.ctx.fillText(text, offsetX, offsetY);
      this.ctx.restore();
    }
  }
  onFontChange(e) {
    this.ctx.fontSize = e.target.value;
  }

  onDestoryClick() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  onEraserClick() {
    this.ctx.strokeStyle = 'white';
    this.isFilling = false;
    this.controls.modeButton.innerText = '✏️ Fill';
  }
  onFileChange(e) {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    };
  }

  onSaveClick() {
    const url = this.canvas.toDataURL();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'myDrawing.png';
    a.click();
  }
  checkMobile() {
    const isMobile = /iPhone|iPad|iPod|Android|Mobile/.test(
      navigator.userAgent
    );
    return isMobile;
  }

  getCoordinates(e) {
    let clientX, clientY;
    if (this.isMobile) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const rect = this.canvas.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    return { clientX: offsetX, clientY: offsetY };
  }
}
const drawingApp = new DrawingApp('canvas1');
