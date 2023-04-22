var pressure = 2000; // psi
var H, W;
const one_gee = 32.2 // ft/s^2
const dt = 0.000001 // microseconds

var plug, piston, elapsed;

var plugLength;
var plugPosition, plugRadius, plugMass;
var pistonPosition, pistonRadius, pistonMass;

var scaleFactor = 1200; // 1200 pixels = 1 foot, 100 pixels = 1 inch



function setup() {
  W = windowWidth;
  H = windowHeight;
  frameRate(20);
  createCanvas(W, H);
  
  plugRadius = 3 // in
  plugMass = 0.2 // lb
  plugPosition = 120;
  plugLength = 600;

  pistonRadius = 2.5 // in
  pistonMass = 2 // lb
  pistonPosition = 500;
  
  plug = new Plug(plugRadius, plugMass, plugPosition, -1);
  piston = new Piston(pistonRadius, pistonMass, pistonPosition, 1);
  elapsed = 0;
  
}

function draw() {
  background(240);
    
  
  stroke(150);
  strokeWeight(1);

  for (let i = 1; i < 9; i++) {
      line(120*i, 100, 120*i, H);
  }

  stroke(0);
  
  piston.update();
  plug.update();
  
  check_collide(piston, plug);
  
  piston.draw();
  plug.draw();
  
  
  
  elapsed += dt;
  
  strokeWeight(0);
  text("Elapsed: " + round(elapsed, 6) + " s", 50, 30);
  text("Plug Velocity: " + round(plug.vel, 1) + "ft/s", 200, 30);
  text("Piston Velocity: " + round(piston.vel, 1) + "ft/s", 350, 30); 

  
  
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
    }
  }
}

class Piston extends Component  {
  draw(self) {
    rect(this.pos, H/2, 75, 100);
  }
}



function check_collide(piston, plug) {
  if (piston.pos > plug.pos + plugLength - 25) {
    
    let vf1 = (pistonMass - plugMass) * piston.vel / (pistonMass + plugMass);
    let vf2 = 2*pistonMass*piston.vel / (pistonMass + plugMass);
    
    piston.vel = vf1;
    plug.vel = vf2;
    
  }
}
