var points = [];
var canvas;
var speed;
var stars = 400;


var t = 0;
var noiseScale=0.01;
var lifetime = 300;
var h = 0.01;
var zoom_scale;
var x_off = 0;
var y_off = 0;
var x_off_old = 0;
var y_off_old = 0;
var soundon = false;


var dx_input;
var dy_input;

var mouse_clk_x = 0;
var mouse_clk_y = 0;

let osc, osc2;

class Point {
  constructor(x, y) {
    this.xpos = x;
    this.ypos = y;
    this.py = this.ypos;
    this.px = this.xpos;
    this.life = random()*lifetime;
  }
}


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-holder');
  speed = 10;
  zoom_scale = 1/200;
  background(0);
  for(var i=0; i<stars; i++){
    points.push(new Point((random()- 1/2)*width*zoom_scale, (random()- 1/2)*height*zoom_scale));
    stroke(255);
    // osc_temp = new p5.Oscillator()
    // osc_temp.amp(0.5);
    // osc.push(osc_temp);

  }
  // osc = new p5.Oscillator();
  // osc2 = new p5.Oscillator();
  //zoom_scale = 504428960.9570371
  updateFunction()

}


// function mouseDragged() {
//   x_off = mouseX - mouse_clk_x + x_off_old;
//   y_off = mouseY - mouse_clk_y + y_off_old;
//   // x_off = mouseX - pmouseX + x_off_old;
//   // y_off = mouseY - mouse_clk_y + y_off_old;
//   // x_off_old = 0;
//   // y_off_old = 0;

//   return false;
// }



function mouseWheel(event) {
  zoom_scale += zoom_scale/1000*event.delta;
  document.getElementById("zoom").innerHTML = str(100*zoom_scale).substring(0,7);

}

// function mouseClicked() {
//   // for(var i=0; i<stars; i++){
//   //   osc[i].start();
//   // }
//   if(soundon){
//     osc.amp(0);
//     soundon = false;
//     osc2.amp(0);
//   } else {
//     // osc.start();  
//     // osc2.start();
//     osc.amp(0.5);
//     osc2.amp(0.5);
//     soundon = true;
//   }
// }

// function mousePressed(){
//   mouse_clk_x = mouseX;
//   mouse_clk_y = mouseY;
//   x_off_old = x_off;
//   y_off_old = y_off;
// }


function keyTyped(){
  if(keyCode == 102){
    let fs = fullscreen();
    fullscreen(!fs);
    resizeCanvas(displayWidth, displayHeight, true);
  }
}


function draw() {  

  // draw semi-transparent background
  background(0,10);

  for(var i=0; i<stars; i++){

    var x = points[i].px;
    var y = points[i].py;

    xspeed = eval(dx_input);
    yspeed = eval(dy_input);

    // update using forward Euler approximation 
    points[i].xpos = x + xspeed;
    points[i].ypos = y + yspeed;

    speed = sqrt(h*points[i].py*h*points[i].py + h*points[i].px*h*points[i].px)

    stroke(150-100*xspeed/speed, 150+speed*60, 150+ 100*yspeed/speed); // color
    line(points[i].xpos/zoom_scale + x_off + width/2, -1*points[i].ypos/zoom_scale + y_off+ height/2, points[i].px/zoom_scale + x_off + width/2, -1*points[i].py/zoom_scale + y_off + height/2);


    points[i].py = points[i].ypos;
    points[i].px = points[i].xpos;
    points[i].life--;
    
    // ToDo: precompute boundries
    if(points[i].ypos/zoom_scale< -height/2 || points[i].xpos/zoom_scale< -width/2  || points[i].xpos/zoom_scale> width/2 || points[i].ypos/zoom_scale > height/2|| points[i].life <0){
      points[i].xpos = (random()- 1/2)*width*zoom_scale + x_off*zoom_scale;
      points[i].ypos = (random()- 1/2)*height*zoom_scale + y_off*zoom_scale;
      points[i].px = points[i].xpos;
      points[i].py = points[i].ypos;
      points[i].pdx = [];
      points[i].pdy = [];
      points[i].life = random()*lifetime;
    }
    
  }

  // osc.freq(xspeed*500000);    
  // osc2.freq(yspeed*600000);
  t+=h;
}


function updateFunction(){
  var dx = document.getElementById("dx");
  var dy = document.getElementById("dy");

  var newdx = "" + str(dx.value);
  newdx = "h*(" + newdx + ")";

  var newdy = "" + str(dy.value);
  newdy = "h*(" + newdy + ")";

  dx_input = newdx;
  dy_input = newdy;
}


function updateRandom(){
  var dx = document.getElementById("dx");
  var dy = document.getElementById("dy");

  rnum = Math.random()*13;

  if(rnum<1) {
    dx_input = "y+x";
    dy_input = "x*cos(y*t)";
    zoom_scale = 1/100;
  } else if(rnum<2) {
    dx_input = "y*sin(y)";
    dy_input = "x*cos(y)";
    zoom_scale = 1/100;
  } else if(rnum<3) {
    dx_input = "y*log(abs(y))";
    dy_input = "x*cos(y)";
    zoom_scale = 0.7/100;
  } else if(rnum<4){
    dx_input = "cos(x)*5";
    dy_input = "sin(y)*5";
    zoom_scale = 1/100;
  }
  else if(rnum<5) {
    // super-sonic hyway
    dx_input = "2.71^(-y)*x/y";
    dy_input = "cos(x) + (sin(y)^2)";
    zoom_scale = 1/100;
  } else if(rnum<6) {
    dx_input = "cos(x)+cos(y)";
    dy_input = "(x^2 + y^2)*cos(t)";
    zoom_scale = 1.43/100;
  } else if(rnum<7) {
    dx_input = "-1*(y + x)";
    dy_input = "-1*(y - x)";
    zoom_scale = 1/100;
  } else if(rnum<8) {
    dx_input = "y";
    dy_input = "x*cos(y*t)";
    zoom_scale = 0.04/100;
  } else if(rnum<9) {
    // spirals in squares 
    zoom_scale = 9000088; //h = 0.03; lifetime = 72
    dx_input = "cos(t)*(y + x)^2";
    dy_input = "cos(t)*(y - x)^2";
  } else if(rnum<10) {
    dx_input = "y*x";
    dy_input = "y*y";
    zoom_scale = 1/100;
  } else if(rnum<11) {
    dx_input = "tan(t)/(abs(x) + abs(y))*(x*cos(t/3) + y*sin(t/3))";
    dy_input = "cos(t)/(abs(x) + abs(y))*(y*cos(t/3) + x*sin(t/3))";
    zoom_scale = 0.05/100;
  } else if(rnum<12) {
    dx_input = "sin(x + y^2)";
    dy_input = "cos(y + x^2)";
    zoom_scale = 1/100;
  } else if(rnum<13) {
    dx_input = "sin(x^2 + y^2)";
    dy_input = "cos(y^2 + x^2)";
    zoom_scale = 1/100;
  }
  
  dx.value = dx_input;
  dy.value = dy_input;
  dx_input = "h*(" + dx_input + ")"
  dy_input = "h*(" + dy_input + ")"
  document.getElementById("zoom").innerHTML = str(100*zoom_scale).substring(0,7);


}