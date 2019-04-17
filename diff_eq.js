var points = [];
var canvas;
var speed;
var stars = 1000;


var time = 0;
var noiseScale=0.01;
var lifetime = 300;
var h = 0.01;
var zoom_scale;
var x_off = 0;
var y_off = 0;
var x_off_old = 0;
var y_off_old = 0;
var soundon = false;

var mouse_clk_x = 0;
var mouse_clk_y = 0;

let osc, osc2;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-holder');
  speed = 10;
  zoom_scale = 1/width
  background(0);
  for(var i=0; i<stars; i++){
    points.push(new Point((random()- 1/2)*width*zoom_scale, (random()- 1/2)*height*zoom_scale));
    stroke(255);
    // osc_temp = new p5.Oscillator()
    // osc_temp.amp(0.5);
    // osc.push(osc_temp);

  }
  osc = new p5.Oscillator();
  osc2 = new p5.Oscillator();
  //zoom_scale = 504428960.9570371

}


function mouseDragged() {
  x_off = mouseX - mouse_clk_x + x_off_old;
  y_off = mouseY - mouse_clk_y + y_off_old;
  // x_off = mouseX - pmouseX + x_off_old;
  // y_off = mouseY - mouse_clk_y + y_off_old;
  // x_off_old = 0;
  // y_off_old = 0;
  console.log(x_off)

  return false;
}


class Point {
  constructor(x, y) {
    this.xpos = x;
    this.ypos = y;
    this.py = this.ypos;
    this.px = this.xpos;
    this.life = random()*lifetime;
  }
}


function mouseWheel(event) {
  zoom_scale += zoom_scale/1000*event.delta;
}

function mouseClicked() {
  // for(var i=0; i<stars; i++){
  //   osc[i].start();
  // }
  if(soundon){
    osc.amp(0);
    soundon = false;
    osc2.amp(0);
  } else {
    // osc.start();  
    // osc2.start();
    osc.amp(0.5);
    osc2.amp(0.5);
    soundon = true;
  }
}

function mousePressed(){
  mouse_clk_x = mouseX;
  mouse_clk_y = mouseY;
  x_off_old = x_off;
  y_off_old = y_off;
}


function keyTyped(){
  if(keyCode == 102){
    let fs = fullscreen();
    fullscreen(!fs);
    resizeCanvas(displayWidth, displayHeight, true);
  }
}

function draw() {
  //stroke("#88aaff");
  

  background(0,10);

  for(var i=0; i<stars; i++){

    // update pos using forward Euler

    if(time<7) {
      xspeed = h*points[i].py;
      yspeed = h*points[i].px*cos(points[i].py*time);
    } else if(time<14) {
      xspeed = h*points[i].py*sin(points[i].py);
      yspeed = h*points[i].px*cos(points[i].py);
    } else if(time<20) {
      xspeed = h*points[i].py*log(abs(points[i].py));
      yspeed = h*points[i].px*cos(points[i].py);
    } else if(time<25){
      // skylar "gas gas gas"; h = 0.01
      xspeed = h*cos(time)*(1-cos(time));
      yspeed = h*points[i].px/points[i].py;
      if(points[i].px/points[i].py > 0.5){
        yspeed = 0;
      }
    } else if(time<30) {
      // super-sonic hyway
      xspeed = h*2.71^(-points[i].py)*points[i].px/points[i].py;
      yspeed = h*(cos(points[i].px) + (sin(points[i].py))^2);
    } else if(time<35) {
      // pool-boi h=0.01
      xspeed = h*(cos(points[i].px)+cos(points[i].py));
      yspeed = h*((points[i].px)^2 + (points[i].py)^2)*cos(time);
    } else if(time<40) {
      // spiral boi (put negs for zoom change), h = 0.04
      xspeed = -1*h*(points[i].py + points[i].px);
      yspeed = -1*h*(points[i].py - points[i].px);
    } else if(time<45) {
      xspeed = h*points[i].py;
      yspeed = h*points[i].px*cos(points[i].py*time);
    } else if(time<55) {
      // spirals in squares 
      zoom_scale = 504428960.9570371; //h = 0.03; lifetime = 72
      xspeed = 1*h*cos(time)*(points[i].py + points[i].px)^2;
      yspeed = 1*h*cos(time)*(points[i].py - points[i].px)^2;
    } else {
      time = 0;
      zoom_scale = 1/width;
    }
    







    

   



    
    // xspeed = h*points[i].py*(points[i].px);
    // yspeed = h*points[i].py*points[i].py;



    // update using forward Euler approximation 
    points[i].xpos = points[i].px + xspeed;
    points[i].ypos = points[i].py + yspeed;

    speed = sqrt(h*points[i].py*h*points[i].py + h*points[i].px*h*points[i].px)

    stroke(150-100*xspeed/speed, 150+speed*60, 150+ 100*yspeed/speed);
    // stroke(30*xspeed/speed+100, speed*200+100, 200+ 70*yspeed/speed);
    // stroke(255);
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

  osc.freq(xspeed*500000);    
  osc2.freq(yspeed*600000);
  time+=h;
  //console.log(zoom_scale)
}