var pressure = 4000; // psi
var H, W;
const one_gee = 32.2 // ft/s^2
const dt = 0.000001 // microseconds
const m2ftpersec = 3.28084;
const gamma = 1.4;
const speedOfSound = 3100 // ft/s
var plug, piston, elapsed;
var plugLength;
var plugPosition, plugRadius, plugMass;
var pistonPosition, pistonRadius, pistonMass;
var scaleFactor = 1200; // 1200 pixels = 1 foot, 100 pixels = 1 inch
var actuation = 0;


function setup() {
  W = windowWidth;
  H = windowHeight;
  frameRate(30);
  createCanvas(W, H);
 
  plugRadius = 3 // in
  plugMass = 30 // lb
  plugPosition = 100;
  plugLength = 850 + 600;

  pistonRadius = 2.5 // in
  pistonMass = 40 // lb
  pistonPosition = 300;
 
  plug = new Plug(plugRadius, plugMass, plugPosition, -1);
  piston = new Piston(pistonRadius, pistonMass, pistonPosition, 1);
  elapsed = 0;
}

function draw() {
  background(240);

  stroke(150);
  strokeWeight(1);

  for (let i = 1; i < 12; i++) {
      line(100*i, 100, 100*i, H);
  }

  stroke(0);
 
 
  for (let i = 0; i < 25; i++) {
    piston.update();
    plug.update();  
    check_collide(piston, plug);
    elapsed += dt;
    if (actuation > 0) {
      if (plug.pos - plugPosition < plugRadius * 0.5 * 100) {
        actuation += dt;      
      } else {
        noLoop();
      }
    }
  }
 
  piston.draw();
  plug.draw();

  strokeWeight(0);
  text("Elapsed: " + round(elapsed, 6) + " s", 50, 30);
  text("Plug Velocity: " + round(ft2m(plug.vel), 1) + "m/s", 200, 30);
  text("Piston Velocity: " + round(ft2m(piston.vel), 1) + "m/s", 350, 30);
  text("Pressure: " + round(pressure, 0) + " psi", 500, 30);
  text("Actuation: " + round(actuation, 6) + " s", 50, 60);
}

class Component {
  constructor(r, m, x, d) {
    this.rad = r;
    this.area = PI * r**2;
    this.mass = m;
    this.pos = x;
    this.vel = 0;
    this.dir = d;
    this.P = calcPressure(this.vel);
  }
 
  calc_accel(self) {
    this.P = calcPressure(this.vel);
    var force = this.P * this.area; // lbf
    var accel = force / this.mass * one_gee;
    return accel;
  }
 
  check(self) {}
 
  update(self) {
    var a = this.calc_accel();
    this.vel += a * dt * this.dir;
    this.pos += this.vel * dt * scaleFactor;
    this.check();
  }
}


class Plug extends Component  {
  draw(self) {
    push();
    translate(this.pos, H/2-20);
    beginShape();
    vertex(0,0);
    vertex(50, 0);
    vertex(50, 65);
    vertex(50+plugLength, 65);
    vertex(50+plugLength, 20);
    vertex(75+plugLength, 20);
    vertex(75+plugLength, 120);
    vertex(50+plugLength, 120);
    vertex(50+plugLength, 75);
    vertex(50, 75);
    vertex(50, 140);
    vertex(0, 140);
    endShape(CLOSE);
    pop();
  }
 
  check(self) {
    if (this.pos < plugPosition) {
      this.pos = plugPosition;
      this.vel = 0;
    }
  }
}

class Piston extends Component  {
 
  check(self) {}
 
  draw(self) {    
    push();
    translate(this.pos, H/2-20);
    beginShape();
    vertex(0, 0);
    vertex(0, 140);
    vertex(700, 140);
    vertex(700, 120);
    vertex(100, 120);
    vertex(100, 20);
    vertex(700, 20);
    vertex(700, 0);
    endShape(CLOSE);
    pop();
  }
}



function check_collide(piston, plug) {
  if (piston.pos > plug.pos + plugLength - 50) {
   
    piston.pos = plug.pos + plugLength - 50;
   
    let vf1 = (pistonMass - plugMass) * piston.vel / (pistonMass + plugMass);
    let vf2 = 2*pistonMass*piston.vel / (pistonMass + plugMass);
   
    piston.vel = vf1 * 0.95;
    plug.vel = vf2 * 0.95;
    
    console.log(piston.P);

    if (actuation == 0) {
      actuation += dt;
    }
  }
}


function ft2m(x) {
  return x*0.3048;
}



function calcPressure(v) {
  if (v) {
    Pp = pressure * (1 - ((gamma-1)/2)*(v/speedOfSound))**(2*gamma/(gamma-1));
    return Pp;
  } else {
    return pressure;
  }
}












// end
