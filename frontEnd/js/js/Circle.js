function Circle(x, y, r = 0, colour = "#ffffff", stroke = 1) {
  Shape.call(this, colour, stroke);
  this.x = x;
  this.y = y;
  this.x2 = x + r;
  this.y2 = y + r;
  this.path.arc(x, y, r, 0, Math.PI * 2, false); // path is inherited
}
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;
Circle.prototype.createPath = function () {
  this.path = new Path2D();
  let xCor = this.x2 - this.x;
  let yCor = this.y2 - this.y;
  let r = Math.sqrt(xCor * xCor + yCor * yCor) / 2;
  this.path.arc(xCor / 2 + this.x, yCor / 2 + this.y, r, 0, Math.PI * 2, false);
};

Circle.prototype.move = function (x, y) {
  if (typeof x === "number" && typeof y === "number") {
    this.x += x;
    this.y += y;
    this.x2 += x;
    this.y2 += y;
    this.createPath();
  } else {
    throw new Error("paramters type not number");
  }
};

Circle.prototype.resize = function (movementX, movementY, side) {
  this.x2 += movementX;
  this.y2 += movementY;
  this.createPath();
};

Circle.prototype.fresize = function(fx , fy){
  this.x *=fx;
  this.y *=fy;
  this.x2 *= fx;
  this.y2 *=fy;
  this.stroke = Math.round(fx*this.stroke);
  this.createPath();
}

Circle.prototype.getResizePoint = function () {
  let points = [];
  let point = new Path2D();
  point.rect(this.x2 - 0.5 * this.stroke, this.y2 - 0.5 * this.stroke, 1 * this.stroke, 1 * this.stroke);
  points.push(point);
  return points;
};
