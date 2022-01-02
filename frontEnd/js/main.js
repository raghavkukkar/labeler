let canva = document.getElementById("labelBoard");
let context = canva.getContext("2d");
let linkButton = document.getElementsByClassName("linkButton");
let toolChangers = document.getElementsByClassName("tools");
let tool = 0;
let resizable = null;
context.lineWidth = 4;
const objectArray = [];
const imgArray = [];
let selected = null;


//constructor for resizable object.  
function Resizable(main, sec = [] , side = null) {
  this.main = main;
  this.sec = sec;
  if(main instanceof Rect)
    this.defaulto = new Rect(main.x , main.y , main.w , main.h) ;
  this.side = side;
}
//constructor for rect object .
function Rect(x, y, width = 0, height = 0) {
  this.x = x;
  this.y = y;
  this.w = width;
  this.h = height;
  this.path = new Path2D();
  this.path.rect(this.x, this.y, this.w, this.h);
}
Rect.prototype.createPath = function () {
  this.path = new Path2D();
  this.path.rect(this.x, this.y, this.w, this.h);
};
//constructor for Circle object .
function Circle(x, y , r = 0){
  this.x = x;
  this.y = y;
  this.r= r;
  this.path = new Path2D();
  this.path.arc(x ,y , r ,0 , Math.PI*2 , false);
}

Circle.prototype.createPath = function(){
  this.path = new Path2D();
  this.path.arc(this.x , this.y , this.r , 0 , Math.PI*2 , false);
}
//redrawing function for canvas rendering 
function redrawing() {
  console.log("yo");
  context.clearRect(0, 0, canva.width, canva.height);
  objectArray.forEach((x) => context.stroke(x.path));
}
// make button with linkButton css class behave as anchor tag
Array.from(linkButton).forEach(x =>{
  x.addEventListener("click" , (ev) => {
    ev.stopPropagation();
    if(ev.target.dataset.href)
      window.location.assign(ev.target.dataset.href);
    ev.preventDefault();
  });
});
// make tool selectors functional
Array.from(toolChangers).forEach(x=>{
  x.addEventListener("click" , (ev) => {
    ev.stopPropagation();
    if(tool === parseInt(ev.target.id))
      return false;
    else{
      selected = null;
      if(resizable){
        resizable = null;
        redrawing();
      }
      let current = document.getElementById(tool);
      current.style.backgroundColor = "";
      tool = parseInt(ev.target.id);
      ev.target.style.backgroundColor = "#727979";
    }  

  })
})
// click event for handling deselecting canvas shape when slicked outside the canvas .
window.addEventListener("click" , (ev)=>{
  if(resizable)
  {resizable = null;
    console.log("lol");
  redrawing();}
});
//delete shapes handler .
window.addEventListener("keydown"  , (ev) => {
  if(ev.key === "Delete" && resizable){
    objectArray.splice(objectArray.indexOf(resizable.main),1);
    resizable = null;
    redrawing();  
  }
});



canva.addEventListener("click" , function(ev){
  ev.stopPropagation();
})

//canvas mouse down event handler 
canva.addEventListener("mousedown", (ev) => {
  ev.stopPropagation();
  if (!ev.button) {
    switch (tool) {
      case 0:
        if (resizable) {
          for(let i = 0 ; i < resizable.sec.length ; i++){
            if (context.isPointInPath(resizable.sec[i], ev.offsetX, ev.offsetY)) {
              tool = 2;
              resizable.side = i;
              return false;
            }
          }
          resizable = null;
          redrawing();
          for (let i = 0; i < objectArray.length; i++) {
              if (
                context.isPointInStroke(
                  objectArray[i].path,
                  ev.offsetX,
                  ev.offsetY
                  )
                  ) {
                    selected = objectArray[i];
                    resizable = new Resizable(selected);
                    break;
                  }
                }
              
        } else {
          for (let i = 0; i < objectArray.length; i++) {
            if (context.isPointInStroke(objectArray[i].path,ev.offsetX,ev.offsetY)) {
              selected = objectArray[i];
              resizable = new Resizable(selected);
              break;
            }
          }
        }

        break;
      case 1:
        objectArray.unshift(new Rect(ev.offsetX, ev.offsetY));
        selected = objectArray[0];
        break;
      case 3:
        objectArray.unshift(new Circle(ev.offsetX , ev.offsetY));
        selected = objectArray[0];
        break;
      default:
        break;
    }
  } 
});
// canvas mouse leave event handler
canva.addEventListener("mouseleave", (ev) => {
  ev.stopPropagation();
  selected = null;
  if (tool == 2){
    resizable = null; 
    tool = 0;
  };
});
// canvas mouse up event handler 
canva.addEventListener("mouseup", (ev) => {
  ev.stopPropagation();
  switch (tool) {
    case 0: 
      if(resizable){
        if(resizable.main instanceof Rect ){
          for(let i = 0 ; i < 4 ; i++)
            resizable.sec.push(new Path2D());
          context.fillStyle = "#fff";
          let mw = 0 , mh = 0;
          for(let i = 0 ; i < 4 ; i++){
            if(i == 1){
              mw = 1; 
            }else if( i ==2 ){
              mh = 1;
            }else if( i == 3){ 
              mw = 0;
            }
            resizable.sec[i].rect(resizable.main.x + resizable.main.w*mw - 0.35 * context.lineWidth,resizable.main.y + resizable.main.h*mh - 0.35 * context.lineWidth, 0.7 * context.lineWidth,0.7 * context.lineWidth);
            context.fill(resizable.sec[i]);
          }
          
        }
      }
      break;
    case 1:
      if(objectArray[0] instanceof Rect){
        if (objectArray[0].w == 0 && objectArray[0].h == 0) {
          objectArray.shift();
          redrawing();
        }  
      }
      else{
        throw "something bad Rect";
      } 
      break;
    case 2:
      resizable = null;
      redrawing();
      tool = 0;
      break;
    case 3:
      if(objectArray[0] instanceof Circle){
        if(objectArray[0].r ==0){
          objectArray.shift();
          redrawing();
        }
      }else{
        throw "Something bad Circle";
      }
    default:
      break;
  }
  selected = null;
});
// canvas mouse move event handler 
canva.addEventListener("mousemove", (ev) => {
  if (tool === 2) {
    if( resizable.main instanceof Rect){
      let {main} = resizable;
      switch (resizable.side ) {
        case 0:
          main.x += ev.movementX;
          main.y +=ev.movementY;
          main.w -= ev.movementX;
          main.h -=ev.movementY;
          break;
        case 1:
          main.w += ev.movementX;
          main.y +=ev.movementY;
          main.h -=ev.movementY;
          break;
        case 2:
          main.w += ev.movementX;
          main.h += ev.movementY; 
          break;
        case 3:
          main.x +=ev.movementX;
          main.w -= ev.movementX;
          main.h += ev.movementY;
          break;
        
        default:
          break;
      }
      main.createPath();
      redrawing();
    }
  }
  if (selected) {
    switch (tool) {
      case 0:
          selected.x = selected.x + ev.movementX;
          selected.y = selected.y + ev.movementY;
          selected.createPath();
          redrawing();      
        break;
      case 1:
        selected.w += ev.movementX;
        selected.h += ev.movementY;
        selected.createPath();
        redrawing();
        break;
      case 3:
        selected.x += ev.movementX/2;
        selected.y += ev.movementY/2;
        selected.r = Math.sqrt((ev.offsetX - selected.x)*(ev.offsetX - selected.x) + (ev.offsetY - selected.y)*(ev.offsetY - selected.y)) ;
        selected.createPath();
        redrawing();
      default:
        break;
    }
  }
});
redrawing();
