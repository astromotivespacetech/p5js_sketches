var pressure = 2000; // psi
var H, W;
const one_gee = 32.2 // ft/s^2
const dt = 0.0001 // microseconds

var plug, piston, elapsed;

function setup() {
  W = windowWidth;
  H = windowHeight;
  frameRate(10);
  createCanvas(W, H);
  
  var plugRadius = 3 // in
  var plugMass = 0.25 // lb
  var plugPosition = 100;

  var pistonRadius = 2.5 // in
  var pistonMass = 1 // lb
  var pistonPosition = 500;
  
  plug = new Plug(plugRadius, plugMass, plugPosition, -1);
  piston = new Piston(pistonRadius, pistonMass, pistonPosition, 1);
  elapsed = 0;
}

function draw() {
  background(220);
  piston.update();
  plug.update();
  
  elapsed += dt;
  
  piston.draw();
  plug.draw();
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
  
  update(self) {
    var a = this.calc_accel();
    this.vel += a * dt * this.dir;
    this.pos += this.vel * dt;
  }
  
}


class Plug extends Component  {
  draw(self) {
    rect(this.pos, H/2, 50, this.rad*30);
  }
}

class Piston extends Component  {
  draw(self) {
    rect(this.pos, H/2, 50, this.rad*30);
  }
}
