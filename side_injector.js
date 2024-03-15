var pressure = 2000; // psi
var H, W;
const one_gee = 32.2 // ft/s^2
const dt = 0.000001 // microseconds
const m2ftpersec = 3.28084;
var plug, piston, elapsed;
var plugLength;
var plugPosition, plugRadius, plugMass;
var pistonPosition, pistonRadius, pistonMass;
var scaleFactor = 360; // 1200 pixels = 1 foot
var inch = scaleFactor/12;
var actuation = 0;

var gases = {
  'air': {
    'gamma': 1.4,
    'ss': 1000
  },
  'helium': {
    'gamma': 1.66,
    'ss': 3100
  }
}

var gas = gases.air;

function in2ft(x) {
  return x / 12;
}

function ft2in(x) {
  return x * 12;
}

function setup() {
  W = windowWidth;
  H = windowHeight;
  frameRate(30);
  createCanvas(W, H);
 
  pistonRadius = 2.5 // in
  pistonMass = 50 // lb
  pistonPosition = 12 // in;
  
  pistonTravel = 12;  // in;
  
  plugRadius = 3 // in
  plugMass = 30 // lb
  plugPosition = 1; // in
  plugLength = pistonPosition-plugPosition+pistonTravel+0.5;  // in

  plug = new Plug(plugRadius, plugMass, in2ft(plugPosition), -1);
  piston = new Piston(pistonRadius, pistonMass, in2ft(pistonPosition), 1);
  elapsed = 0;
}

function draw() {
  background(240);

  stroke(150);
  strokeWeight(1);

  for (let i = 1; i < 30; i++) {
      line(inch*i, inch, inch*i, H);
  }

  stroke(0);
 
 
  for (let i = 0; i < 50; i++) {
    piston.update();
    plug.update();  
    check_collide(piston, plug);
    elapsed += dt;
    if (actuation > 0) {
      if (plug.pos - in2ft(plugPosition) < in2ft(plugRadius) * 0.5) {
        actuation += dt;      
        // pressure -= ft2in(plug.pos)**2;   // simulates the pressure dropping as plug retracts, not accurate
      } else {
        noLoop();
      }
    }
  }
 
  plug.draw();
  piston.draw();
  
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
    this.pos += this.vel * dt;
    this.check();
  }
}


class Plug extends Component  {
  draw(self) {
    push();
    translate(ft2in(this.pos)*inch, H/2-plugRadius*inch);
    beginShape();
    vertex(0,0);
    vertex(0.5*inch, 0);
    vertex(0.5*inch, plugRadius*inch-0.5*inch);
    vertex(0.5*inch+plugLength*inch, plugRadius*inch-0.5*inch);
    vertex(0.5*inch+plugLength*inch, (plugRadius-pistonRadius)*inch);
    vertex(1*inch+plugLength*inch, (plugRadius-pistonRadius)*inch);
    vertex(1*inch+plugLength*inch, plugRadius*2*inch - (plugRadius-pistonRadius)*inch);
    vertex(0.5*inch+plugLength*inch, plugRadius*2*inch - (plugRadius-pistonRadius)*inch);
    vertex(0.5*inch+plugLength*inch, plugRadius*inch+0.5*inch);
    vertex(0.5*inch, plugRadius*inch+0.5*inch);
    vertex(0.5*inch, plugRadius*2*inch);
    vertex(0, plugRadius*2*inch);
    endShape(CLOSE);
    pop();
  }
 
  check(self) {
    if (this.pos < in2ft(plugPosition)) {
      this.pos = in2ft(plugPosition);
      this.vel = 0;
    }
  }
}

class Piston extends Component  {
 
  check(self) {}
 
  draw(self) {    
    push();
    translate(ft2in(this.pos)*inch, H/2-pistonRadius*inch);
    beginShape();
    vertex(0, 0);
    vertex(0, pistonRadius*2*inch);
    vertex(inch, pistonRadius*2*inch);
    vertex(inch, 0);
    endShape(CLOSE);
    pop();
  }
}



function check_collide(piston, plug) {
  if (piston.pos > plug.pos + in2ft(plugLength - 0.5)) {
   
    piston.pos = plug.pos + in2ft(plugLength - 0.5);
   
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
    Pp = pressure * (1 - ((gas.gamma-1)/2)*(v/gas.ss))**(2*gas.gamma/(gas.gamma-1));
    return Pp;
  } else {
    return pressure;
  }
}












// end
