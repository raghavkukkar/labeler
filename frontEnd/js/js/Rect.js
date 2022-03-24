function Rect(x, y, width = 0, height = 0, colour = "#00ff00", stroke = 7) {
  Shape.call(this, colour, stroke);
  this.x = x;
  this.y = y;
  this.w = width;
  this.h = height;
  this.path.rect(this.x, this.y, this.w, this.h); // path is inhereted
}
Rect.prototype = Object.create(Shape.prototype);
Rect.prototype.constructor = Rect;
Rect.prototype.createPath = function () {
  this.path = new Path2D();
  this.path.rect(this.x, this.y, this.w, this.h);
};

Rect.prototype.move = function (x, y) {
  if (typeof x === "number" && typeof y === "number") {
    this.x += x;
    this.y += y;
    this.createPath();
  } else {
    throw new Error("parameters type not number");
  }
};

Rect.prototype.resize = function (movementX, movementY, side = 3) {
  switch (side) {
    case 0:
      this.x += movementX;
      this.y += movementY;
      this.w -= movementX;
      this.h -= movementY;
      break;
    case 1:
      this.w += movementX;
      this.y += movementY;
      this.h -= movementY;
      break;
    case 2:
      this.w += movementX;
      this.h += movementY;
      break;
    case 3:
      this.x += movementX;
      this.w -= movementX;
      this.h += movementY;
      break;

    default:
      break;
  }
  this.createPath();
};

Rect.prototype.fresize = function(fx , fy){
  this.x *= fx;
  this.y *= fy;
  this.w *=fx;
  this.h *= fy;
  this.stroke *=fx; 
  this.createPath();

}

Rect.prototype.getResizePoint = function () {
  let mw = 0,
    mh = 0;
  let points = [];

  for (let i = 0; i < 4; i++) {
    points.push(new Path2D());
    if (i == 1) {
      mw = 1;
    } else if (i == 2) {
      mh = 1;
    } else if (i == 3) {
      mw = 0;
    }
    points[i].rect(
      this.x + this.w * mw - 0.35 * this.stroke,
      this.y + this.h * mh - 0.35 * this.stroke,
      0.7 * this.stroke,
      0.7 * this.stroke
    );
  }
  return points;
};
