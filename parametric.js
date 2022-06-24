var R_t = 5.08 / 2;
var scaleFactor = 30;
var thetaE = 11; // deg
var thetaN = 26; // deg
var expansion_ratio =  8.70;


function setup() {
  W = windowWidth;
  H = windowHeight;
  createCanvas(W, H);
  x_axis = new X_axis();
  y_axis = new Y_axis();
  tc = new Param_EQ( createVector(radians(-135),radians(-90)), ftc );
  td = new Param_EQ( createVector(radians(-90), radians(thetaN-90)), ftd );
  nb = new Param_EQ( createVector(0,1), fnb );
}

function draw() {
  background(0);
  x_axis.draw();
  y_axis.draw();
  tc.draw();
  td.draw();
  nb.draw();
}

function ftc(t) {
  let x = 1.5 * R_t * cos(t);
  let y = 1.5 * R_t * sin(t) +1.5*R_t + R_t;
  return createVector(x*scaleFactor,y*scaleFactor);
}

function ftd(t) {
  let x = 0.382 * R_t * cos(t);
  let y = 0.382 * R_t * sin(t) + 0.382*R_t + R_t;
  return createVector(x*scaleFactor,y*scaleFactor);
}

function fnb(t) {
  let Nx = 0.382 * R_t * cos(radians(thetaN-90));
  let Ny = 0.382 * R_t * sin(radians(thetaN-90)) + 0.382*R_t + R_t;
  let Ex = 0.8 * (((expansion_ratio**0.5 - 1) * R_t)/tan(radians(15)));
  let Ey = expansion_ratio**0.5 * R_t;
  let m1 = tan(radians(thetaN));
  let m2 = tan(radians(thetaE));
  let C1 = Ny - m1*Nx;
  let C2 = Ey - m2*Ex;
  let Qx = (C2-C1)/(m1-m2);
  let Qy = (m1*C2-m2*C1)/(m1-m2);
  x = (1-t)**2 * Nx + 2*(1-t)*t*Qx + t**2*Ex;
  y = (1-t)**2 * Ny + 2*(1-t)*t*Qy + t**2*Ey;
  return createVector(x*scaleFactor,y*scaleFactor);
}

class Param_EQ {
  constructor(range, f) {
    this.points = [];
    this.range = range;
    this.f = f;
    for (let t = range.x; t<range.y; t+=0.01) {
      this.points.push( this.f(t) );
    }
  }


  draw() {
    noFill();
    push();
    translate(W/2, H/2);
    for (let i = 0; i < this.points.length; i++) {
      if (i != 0) {
        // let r = 255 * ((this.points.length-i*0.9)/this.points.length);
        // let g = 255 * ((this.points.length-i)/this.points.length);
        // let b = 255 * ((this.points.length-i*0.5)/this.points.length);
        let r = 255;
        let g = 0;
        let b = 0;
        stroke(r,g,b);
        line(this.points[i].x, this.points[i].y, this.points[i-1].x, this.points[i-1].y);
        line(this.points[i].x, -this.points[i].y, this.points[i-1].x, -this.points[i-1].y);

      }
    }
    pop();
  }
}



class X_axis {
  constructor() {}

  draw() {
    noFill();
    stroke(100);
    push();
    translate(W/2, H/2);
    line(-W, 0, W, 0);
    pop();
  }
}

class Y_axis {
  constructor() {}

  draw() {
    noFill();
    stroke(100);
    push();
    translate(W/2, H/2);
    line(0, -H, 0, H);
    pop();
  }
}
