G = 1.62;       // [m/s] acceleration of gravity on moon
g = 9.80665;    // [m/s] Earth gravity
zoom = 10;
dt = 0.02;

function setup() {
  W = windowWidth;
  H = windowHeight;
  createCanvas(W, H);
  frameRate(1/dt);
  moon = new Moon();
  astronaut = new Astronaut( createVector(W/2, H-100) );
  jetpack = new Jetpack(astronaut);
}

function draw() {
  background(0);
  if (keyIsDown(UP_ARROW)) {
    jetpack.thrust = createVector(0, -300);
    jetpack.astronaut.orientation = PI;
    if (keyIsDown(LEFT_ARROW)){
      jetpack.thrust.rotate(-PI/4);
      jetpack.astronaut.orientation -= PI/8;
    } else if (keyIsDown(RIGHT_ARROW)) {
      jetpack.thrust.rotate(PI/4);
      jetpack.astronaut.orientation += PI/8;
    }
    jetpack.applyThrust();
  }
  astronaut.update();
  astronaut.check(moon);
  astronaut.display();
  moon.display();

}



class Astronaut {

  constructor(pos) {
    this.pos = pos;
    this.vel = createVector();
    this.size = createVector(1, 2);
    this.mass = 75;   // [kg]
    this.accel = createVector(0, G);
    this.orientation = PI;
  }

  check(surface) {
    if (this.pos.y > surface.pos.y) {
      this.pos.y = surface.pos.y;
      this.vel.y = 0;
    }
  }

  update() {
    this.accel.mult(dt);
    this.accel.mult(zoom);
    this.vel.add(this.accel);
    this.pos.add(p5.Vector.mult(this.vel, dt));
    this.accel = createVector(0, G);
  }

  display() {
    push();
    noStroke();
    fill(255);
    translate(this.pos.x, this.pos.y);
    rotate(this.orientation);
    rect(0, 0, this.size.x*zoom, this.size.y*zoom);
    pop();
  }
}


class Jetpack {

  constructor(a) {
    this.astronaut = a;
    this.thrust = createVector(0, -300);   // [N] in the "up" direction
    this.mass_prop = 52;   // [kg]
    this.Isp = 315  // [sec]
    this.flow_rate = this.thrust.mag() / this.Isp / g;
    this.flight_time = this.mass_prop / this.flow_rate;
    console.log(this.flight_time/60);
  }

  applyThrust() {
    let force = p5.Vector.div(this.thrust, this.astronaut.mass+this.mass_prop);
    this.astronaut.accel.add(force);
    push();
    translate(this.astronaut.pos.x, this.astronaut.pos.y);
    rotate(this.astronaut.orientation);
    fill(255,255,0);
    rect(this.astronaut.size.x*zoom*0.25, 0, this.astronaut.size.x*zoom*0.5, -this.astronaut.size.y*zoom*0.5);
    pop();
    this.mass_prop -= this.flow_rate * dt;
    console.log(this.mass_prop);
    if (this.mass_prop < 0) {
      noLoop();
    }
  }

}


class Moon {

  constructor() {
    this.depth = 100;
    this.pos = createVector(0, H-this.depth);
  }

  display() {
    noStroke();
    fill(200);
    rect(this.pos.x, this.pos.y, W, this.depth);
  }

}
