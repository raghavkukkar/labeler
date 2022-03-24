/**
 * 
 * @todo resize logic for shapes 
 * @approch calculate the percentage increase/decrease in both the direction and multiply that to get new dimensions .
 * 
 * @todo save logic 
 * @cavaets scale the shapes according to the real dimension of the image. 
 * @returns 
 */

function calculateDims(canvas) {
  let lbc = canvas.parentNode;
  return [lbc.clientWidth - 36, lbc.clientHeight];
}


function movableCanvas(canvas, context,defaultColour , mouseBinder = true) {
  this.canvas = canvas;
  this.context = context;
  this.objectArray = [];
  this.selected = null;
  this.selectedColour = defaultColour;
  this.resizable = null;
  this.background = "";
  if (mouseBinder) {
    this.tool = 0;
  }
}

movableCanvas.prototype.add = function (shape) {
  this.objectArray.unshift(shape);
  this.selected = shape;
};

movableCanvas.prototype.setColour = function (colour){
  let match;
  if (colour[0] === "#") {
    if ((colour.length === 4 && colour.match(/^\#[A-F0-9a-f]{3}$/)) || (colour.length === 7 && colour.match(/^\#[A-Fa-f0-9]{6}$/))) {
      if (colour.length === 4) this.selectedColour = `#${colour[1]}${colour[1]}${colour[2]}${colour[2]}${colour[3]}${colour[3]}`;
      else this.selectedColour = colour;
    } 
  } else if ((match = colour.match(/^[Rr][gG][bB]\((?<r>\d{1,3}),(?<g>\d{1,3}),(?<b>\d{1,3})\)$/))) {
    let c = [match.groups.r, match.groups.g, match.groups.b];
    this.selectedColour = c.reduce((a, b) => {
      let value = parseInt(b);
      if (value >= 0 && value < 256) value = value.toString(16);
      else {
        value = "ff";
      }
      return a + value;
    }, "#");
  }
}

movableCanvas.prototype.resizeCanvas = function(){
  let ogHeight = this.canvas.height ;
  let ogWidth = this.canvas.width;
  let aspect = this.background.height / this.background.width;
  let [availableWidth, availableHeight] = calculateDims(this.canvas);
  this.canvas.width = this.background.width + 7 > availableWidth ? availableWidth - 7 : this.background.width;
  if (aspect * this.canvas.width + 10 > availableHeight) {
    this.canvas.height = availableHeight - 10 > this.background.height ? this.background.height : availableHeight - 10;
    this.canvas.width = (this.canvas.height * this.background.width) / this.background.height;
  } else this.canvas.height = aspect * this.canvas.width;
  let factorInX = this.canvas.height/ogHeight;
  let factorInY = this.canvas.width/ogWidth;
  this.redrawing(factorInX , factorInY);
}



movableCanvas.prototype.changeBackground = function (uri) {
  this.background = new Image();
  this.background.src = uri;
  this.background.onload = (ev) => {
    this.resizeCanvas();
  };
  this.selected = null;
  this.resizable = null;
  this.objectArray = [];
};

movableCanvas.prototype.redrawing = function (fx = null , fy = null) {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.context.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
  for (let i = this.objectArray.length - 1; i >= 0; i--) {
    if(fx && fy){
      this.objectArray[i].fresize(fx , fy);
    }
    this.context.lineWidth =  this.objectArray[i].stroke;
    this.context.strokeStyle = this.objectArray[i].colour;
    this.context.stroke(this.objectArray[i].path);
  }
};

movableCanvas.prototype.checkObject = function (x, y) {
  let object = null;
  this.objectArray.some((o) => {
    if (this.context.isPointInStroke(o.path, x, y)) {
      this.selected = o;
      this.resizable = new Resizable(this.selected);
      object = o;
      return true;
    }
  });
  return object;
};

movableCanvas.prototype.changeTool = function (tool) {
  if (this.tool === undefined) {
    throw new Error("this method is not defined when mouseBinder constructor argument is false.");
  }
  if (typeof tool !== "number" && Number.isInteger(tool) && tool >= 0)
    throw new Error("Argument tool not of type number or is not an integer greater than or equal to zero.");
  this.tool = tool;
};

function bindDown(ev) {
  ev.stopPropagation();
  if (!ev.button) {
    switch (this.tool) {
      case 0:
        if (this.resizable) {
          for (let i = 0; i < this.resizable.sec.length; i++) {
            if (context.isPointInPath(this.resizable.sec[i], ev.offsetX, ev.offsetY)) {
              this.changeTool(2);
              this.resizable.side = i;
              return false;
            }
          }
          this.resizable = null;
          this.redrawing();
          this.checkObject(ev.offsetX, ev.offsetY);
        } else {
          this.checkObject(ev.offsetX, ev.offsetY);
        }
        break;
      case 1:
        this.add(new Rect(ev.offsetX, ev.offsetY ,0,0, this.selectedColour));
        break;
      case 3:
        this.add(new Circle(ev.offsetX, ev.offsetY ,0, this.selectedColour));
        break;
      case 4:
        this.checkObject(ev.offsetX , ev.offsetY);
      default:
        break;
    }
  }
}

function bindUp(ev) {
  ev.stopPropagation();
  switch (this.tool) {
    case 0:
      if (this.resizable) {
        let points = (this.resizable.sec = this.resizable.main.getResizePoint());
        this.context.fillStyle = this.resizable.main.getComplement();
        points.forEach((point) => {
          this.context.fill(point);
        });
      }
      break;
    case 1:
      if (this.objectArray[0] instanceof Rect) {
        if (this.objectArray[0].w == 0 && this.objectArray[0].h == 0) {
          this.objectArray.shift();
          this.redrawing();
        }
      } else {
        throw "something bad Rect";
      }
      break;
    case 2:
      this.resizable = null;
      this.redrawing();
      this.changeTool(0);
      break;
    case 3:
      if (this.objectArray[0] instanceof Circle) {
        if (this.objectArray[0].r == 0) {
          this.objectArray.shift();
          this.redrawing();
        }
      } else {
        throw "Something bad Circle";
      }
      break;
    case 4:
      if(this.selected){
        this.selected.setColour(this.selectedColour);
        this.redrawing();
      }
    default:
      break;
  }
  this.selected = null;
}

function bindLeave(ev) {
  ev.stopPropagation();
  this.selected = null;
  if (this.tool == 2) {
    this.resizable = null;
    this.changeTool(0);
  }
}

function bindMove(ev) {
  if (this.tool === 2) {
    let { main, side } = this.resizable;
    main.resize(ev.movementX, ev.movementY, this.resizable.side);
    this.redrawing();
  }
  let { selected , tool } = this;
  if (selected) {
    switch (tool) {
      case 0:
        selected.move(ev.movementX, ev.movementY);
        selected.createPath();
        this.redrawing();
        break;
      case 1:
        selected.w += ev.movementX;
        selected.h += ev.movementY;
        selected.createPath();
        this.redrawing();
        break;
      case 3:
        selected.x2 = ev.offsetX;
        selected.y2 = ev.offsetY;
        selected.createPath();
        this.redrawing();
      default:
        break;
    }
  }
}

movableCanvas.prototype.bindEvents = function () {
  this.canvas.addEventListener("click", function (ev) {
    ev.stopPropagation();
  });
  
  this.canvas.addEventListener("mousedown", bindDown.bind(this));
  this.canvas.addEventListener("mouseup", bindUp.bind(this));
  this.canvas.addEventListener("mouseleave", bindLeave.bind(this));
  this.canvas.addEventListener("mousemove", bindMove.bind(this));
};
