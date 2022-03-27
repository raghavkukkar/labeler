let canva = document.getElementById("labelBoard");
let context = canva.getContext("2d");
let linkButton = document.getElementsByClassName("linkButton");
let toolChangers = Array.from(document.getElementsByClassName("tools"));
let colourPicker = toolChangers.find((e) => e.name === "current");
let slider = toolChangers.find((e) => e.name === "strokeWidth");

let movable = new movableCanvas(canva, context, colourPicker.value, parseInt(slider.value), true);
movable.bindEvents();
movable.changeBackground("./background2.png");

window.addEventListener("resize", (ev) => {
  movable.resizeCanvas();
});

Array.from(linkButton).forEach((x) => {
  x.addEventListener("click", (ev) => {
    ev.stopPropagation();
    if (ev.target.dataset.href) window.location.assign(ev.target.dataset.href);
    ev.preventDefault();
  });
});

toolChangers.forEach((x) => {
  x.addEventListener("click", (ev) => {
    ev.stopPropagation();
    if (movable.tool === parseInt(ev.target.id)) return false;
    else {
      movable.selected = null;
      if (movable.resizable) {
        movable.resizable = null;
        movable.redrawing();
      }
      let current = document.getElementById(movable.tool);
      current.style.backgroundColor = "";
      movable.changeTool(parseInt(ev.target.id));
      ev.target.style.backgroundColor = "#727979";
    }
  });
});
window.addEventListener("click", (ev) => {
  if (movable.resizable) {
    movable.resizable = null;
    movable.redrawing();
  }
});
//delete shapes handler .
window.addEventListener("keydown", (ev) => {
  if (ev.key === "Delete" && movable.resizable) {
    movable.objectArray.splice(movable.objectArray.indexOf(movable.resizable.main), 1);
    movable.resizable = null;
    movable.redrawing();
  }
});

slider.addEventListener

colourPicker.addEventListener("change", (ev) => {
  movable.setColour(ev.target.value);
});

slider.addEventListener("change" , (ev) => {
  movable.setWidth(parseInt(ev.target.value));
});

slider.addEventListener("input" , (ev) => {
  // console.log("hello");
  // console.log(ev.target.value);
  movable.setShapeWidth(ev.target.value);
});