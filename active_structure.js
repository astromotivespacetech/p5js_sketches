var particles = [];

function setup() {

  W = windowWidth;
  H = windowHeight;
  createCanvas(W, H);

  mode = 0;
  power = -100;
  g = 9.81;
  dt = 1/50;

  frameRate(50);
  for (let i = 0; i < 1; i++) {
    particles.push(new Particle(createVector(W/2, H)));
  }
  p = new Platform(createVector(W/2, H - 50));
  s = new GroundStation(createVector(W/2, H));
}

function draw() {
  background(0);
  text("Power: " + -power, 30, 20);
  text("Particles: " + particles.length, 30, 40);
  for (let i = 0; i < particles.length; i++) {
    checkCollision(particles[i],p);
    particles[i].update();
    particles[i].display();
  }

  p.update();
  p.display();

  s.display();
}

function mouseClicked() {
  if (mode == 1) {
    power -= 1;
  } else {
    particles.push(new Particle(createVector(W/2, H)));
  }
}

function keyPressed() {
  if (keyCode == TAB) {
    mode == 0 ? mode = 1 : mode = 0;
  }
}

class Particle {

  constructor(pos) {
    this.size = 10;
    this.m = 1;
    this.accel = 0;
    this.vel = power;
    this.pos = pos;
    this.momentum = this.vel * this.m;
  }

  display() {
    noStroke();
    fill(200);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  update() {
    this.accel += g;
    this.vel += this.accel * dt;
    this.pos.y += this.vel * dt;
    this.momentum = this.vel * this.m;
    this.accel = 0;
  }

}


class Platform {

  constructor(pos, mass) {
    this.pos = pos;
    this.accel = 0;
    this.vel = 0;
    this.m = 100;
    this.size = createVector(50, 5);
    this.momentum = this.vel * this.m;
  }

  display() {
    noStroke();
    fill(255);
    rect(this.pos.x-this.size.x*0.5, this.pos.y-this.size.y, this.size.x, this.size.y);
  }

  update() {
    this.accel += g;
    this.vel += this.accel * dt;
    this.pos.y += this.vel * dt;
    this.momentum = this.vel * this.m;
    this.accel = 0;
  }


}



class GroundStation {

  constructor(pos, mass) {
    this.pos = pos;
    this.accel = 0;
    this.vel = 0;
    this.size = createVector(50, 5);
  }

  display() {
    noStroke();
    fill(255);
    rect(this.pos.x-this.size.x*0.5, this.pos.y-this.size.y, this.size.x, this.size.y);
  }

}



function checkCollision(b, p) {

  if (b.pos.y < p.pos.y) {
    b.pos.y = p.pos.y;
    let bvel = (b.m - p.m)/(b.m + p.m) * b.vel + (2 * p.m)/(b.m + p.m) * p.vel;
    let pvel = (2 * b.m)/(b.m + p.m) * b.vel + (p.m - b.m)/(b.m + p.m) * p.vel;
    b.vel = bvel;
    p.vel = pvel;
  }

  if (b.pos.y > H) {
    b.pos.y = H;
    b.vel = power;
  }

  if (p.pos.y > H - 50) {
    p.pos.y = H - 50;
    // p.vel = 0;
  }
}
