function Shape(colour, stroke) {
  this.stroke = stroke;
  this.path = new Path2D();
  this.colour = colour;
}

Shape.prototype.setWidth = function(width){
  if(typeof width === "number"){
    this.stroke = width^0;
  }else{
    throw new Error("the argument for method setWidth is not a number")
  }
}
Shape.prototype.getComplement = function () {
  let comp = "#";
  for (let i = 1; i < 7; i = i + 2) {
    let value = 255 - parseInt(this.colour[i] + this.colour[i + 1], 16);
    value = value.toString(16);
    if (value.length == 1) {
      value = value + value;
    }
    comp = comp + value;
  }
  return comp;
};
Shape.prototype.setColour = function (...colour) {
  if (colour.length === 1) colour = colour[0];
  else {
    if (colour.length !== 3) throw new Error("too many or less arguments for setting colour");
    let value = "#";
    for (let i = 0; i < 3; i++) {
      if (typeof colour[i] != "number" && (colour[i] > 255 || colour[i] < 0))
        throw new Error("argument not of correct(number) type and range [0-255]");
      colour[i] = Math.floor(colour[i]);
      colour[i] = colour[i].toString(16);
      if (colour[i].length == 1) {
        colour[i] = colour[i] + colour[i];
      }
      value = value + colour[i];
    }
    this.colour = value;
    return;
  }
  if (typeof colour != "string") {
    throw new Error("Parameter not a string");
  }
  let match;
  if (colour[0] === "#") {
    if ((colour.length === 4 && colour.match(/^\#[A-F0-9a-f]{3}$/)) || (colour.length === 7 && colour.match(/^\#[A-Fa-f0-9]{6}$/))) {
      if (colour.length === 4) this.colour = `#${colour[1]}${colour[1]}${colour[2]}${colour[2]}${colour[3]}${colour[3]}`;
      else this.colour = colour;
    } else {
      this.colour = "#696969";
    }
  } else if ((match = colour.match(/^[Rr][gG][bB]\((?<r>\d{1,3}),(?<g>\d{1,3}),(?<b>\d{1,3})\)$/))) {
    let c = [match.groups.r, match.groups.g, match.groups.b];
    this.colour = c.reduce((a, b) => {
      let value = parseInt(b);
      if (value >= 0 && value < 256) value = value.toString(16);
      else {
        value = "ff";
      }
      return a + value;
    }, "#");
  } else {
    switch (colour) {
      case "black":
        this.colour = "#000000";
        break;
      case "white":
        this.colour = "#ffffff";
        break;
      case "red":
        this.colour = "#ff0000";
        break;
      case "green":
        this.colour = "#00ff00";
        break;
      case "blue":
        this.colour = "#0000ff";
        break;
      default:
        this.colour = "#ffffff";
        break;
    }
  }
};
