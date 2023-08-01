var pressure = 2000; // psi
var H, W;
const one_gee = 32.2 // ft/s^2
const dt = 0.000001 // microseconds
const m2ftpersec = 3.28084;

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
  plugMass = 4.25 // lb
  plugPosition = 100;
  plugLength = 850;

  pistonRadius = 2 // in
  pistonMass = 33 // lb
  pistonPosition = 325;
  
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
  }
  
  calc_accel(self) {
    var force = pressure * this.area; // lbf
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
    translate(this.pos, H/2);
    beginShape();
    vertex(0,0);
    vertex(50, 0);
    vertex(50, 45);
    vertex(50+plugLength, 45);
    vertex(50+plugLength, 0);
    vertex(75+plugLength, 0);
    vertex(75+plugLength, 100);
    vertex(50+plugLength, 100);
    vertex(50+plugLength, 55);
    vertex(50, 55);
    vertex(50, 100);
    vertex(0, 100);
    endShape(CLOSE);
    pop();
  }
  
  check(self) {
    if (this.pos < plugPosition) {
      this.pos = plugPosition;
      this.vel = 0;
    } else {
      pressure -= (this.pos - plugPosition);
      if (pressure < 0) { pressure = 0; }
    }
  }
}

class Piston extends Component  {
  
  check(self) {}
  
  draw(self) {
    rect(this.pos, H/2, 75, 100);
  }
}



function check_collide(piston, plug) {
  if (piston.pos > plug.pos + plugLength - 25) {
    
    piston.pos = plug.pos + plugLength - 25;
    
    let vf1 = (pistonMass - plugMass) * piston.vel / (pistonMass + plugMass);
    let vf2 = 2*pistonMass*piston.vel / (pistonMass + plugMass);
    
    piston.vel = vf1 * 0.9;
    plug.vel = vf2 * 0.9;
    
    if (actuation == 0) {
      actuation += dt;
    }
    
  }
}


function ft2m(x) {
  return x*0.3048;
}

// end
