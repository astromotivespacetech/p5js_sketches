var asteroids = [];
var beams     = [];
var count     = 0;
var score     = 0;
var level     = 0;

function setup() {
  W           = windowWidth;
  H           = windowHeight;
  createCanvas(W, H);
  spaceship = new Spaceship();
  for (let i = 0; i < 6; i++) {
    asteroids.push(new Asteroid(3, random(W), random(H)));
  }
}

function draw() {
  background(20);
  count += 1;
  checkCollision();
  if (keyIsDown(LEFT_ARROW)) {
    spaceship.angular_velocity = -0.1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    spaceship.angular_velocity = 0.1;
  }
  if (keyIsDown(UP_ARROW)) {
    let v = createVector(0,-0.15);
    v.rotate(spaceship.orientation);
    spaceship.velocity.add(v);
  }
  if (keyIsDown(32)) {
    spaceship.fire();
  }
  for (let i = asteroids.length; i > 0; i--) {
    asteroids[i-1].draw();
  }
  for (let i = beams.length; i > 0; i--) {
    checkBeam(beams[i-1], i);
  }
  for (let i = beams.length; i > 0; i--) {
    beams[i-1].draw();
    for (let j = asteroids.length; j > 0; j--) {
      if (beams[i-1].checkAsteroid(asteroids[j-1])) {
        beams.splice(i-1, 1);
        let r = asteroids[j-1].r;
        let x = asteroids[j-1].pos.x;
        let y = asteroids[j-1].pos.y;
        asteroids.splice(j-1, 1);
        if (r > 0) {
          asteroids.push(new Asteroid(r-1, x, y));
          asteroids.push(new Asteroid(r-1, x, y));
        }
        if (asteroids.length == 0) {
            level += 1;
            for (let i = 0; i < 6; i++) {
              asteroids.push(new Asteroid(3, random(W), random(H)));
            }
        }
        break;
      }
    }
  }
  spaceship.draw();
  textSize(16);
  fill(255);
  text('POWER: ' + spaceship.power, 10, 30);
  text('SCORE: ' + score, 350, 30);
  text('LEVEL: ' + (level+1), 450, 30);
  textSize(10);
  fill(125);
  text('TURN: L+R ARROWS    MOVE: UP ARROW    SHOOT: SPACE BAR', 100, (H-5));
  noStroke();
  rect(115, 16, spaceship.power*2, 16);
  stroke(255);
  strokeWeight(1);
  noFill();
  rect(115, 16, 200, 16);
}



class Spaceship {

  constructor() {
    this.power            = 100;
    this.pos              = createVector(W/2, H/2);
    this.angular_velocity = 0;
    this.velocity         = createVector(0, 0);
    this.vel_mag          = 0;
    this.orientation      = 0;
    this.a_dampening      = 0.9;
    this.v_dampening      = 0.98;
  }

  fire() {
    if (this.power > 0) {
      beams.push(new Beam(this));
    }
    if (this.power > 0) { this.power -= 1 }
  }

  draw() {
    checkEdges(this);
    this.orientation        += this.angular_velocity;
    this.pos.add(this.velocity);
    this.angular_velocity   *= this.a_dampening;
    this.velocity.mult(this.v_dampening);
    fill(255);
    noStroke();
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.orientation);
    beginShape();
    vertex(-10, 10);
    vertex(0, -20);
    vertex(10, 10);
    vertex(0, 5);
    endShape(CLOSE);
    pop();
    if (count % 10 == 0) {
      this.power += 1;
      if (this.power > 100) { this.power = 100 }
    }
  }
}


class Asteroid {

  constructor(r, x, y) {
    this.orientation      = 0;
    this.angular_velocity = random(-0.05,0.05);
    let a                 = -1 - level*0.25;
    let b                 = 1 + level*0.25;
    this.velocity         = createVector(random(a,b), random(a,b));
    this.r                = r;
    this.radius           = random(10*r, 20*r);
    if (this.radius < 5) { this.radius = 5 }
    this.pos              = createVector(x, y);
    while (this.pos.dist(spaceship.pos) < this.radius*2) {
      this.pos            = createVector(random(W), random(H));
    }
    this.points           = [];
    for (let i = 0; i < 10; i++) {
      let p               = createVector(this.radius + random(-this.radius/2,5),0);
      p.rotate(TWO_PI * (i/10));
      this.points.push(p);
    }
  }


  draw() {
    checkEdges(this);
    this.orientation += this.angular_velocity;
    this.pos.add(this.velocity);
    strokeWeight(2);
    stroke(175, 150, 125, 40);
    fill(175, 150, 125, 20);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.orientation);
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      vertex(this.points[i].x, this.points[i].y);
    }
    endShape(CLOSE);
    pop();
  }
}


class Beam {

  constructor(x) {
    this.initpos      = x.pos.copy();
    this.truepos      = x.pos.copy();
    this.pos          = createVector(0, 0);
    this.orientation  = x.orientation;
    this.velocity     = -10.0;
  }

  draw() {
    noStroke();
    fill(255, 55, 55);
    push();
    translate(this.initpos.x, this.initpos.y);
    rotate(this.orientation);
    let v             = createVector(0, this.velocity);
    this.pos.add(v);
    this.truepos.add(v.rotate(this.orientation));
    rect(this.pos.x, this.pos.y, 2, 8);
    pop();
  }

  checkAsteroid(asteroid) {
    if (this.truepos.dist(asteroid.pos) <= asteroid.radius*1.5) {
      score += 1;
      return 1;
    }
    else { return 0; }
  }
}


function checkEdges(obj) {
    if (obj.pos.x > W) { obj.pos.x = 0; }
    if (obj.pos.x < 0) { obj.pos.x = W; }
    if (obj.pos.y > H) { obj.pos.y = 0; }
    if (obj.pos.y < 0) { obj.pos.y = H; }
}

function checkBeam(obj, i) {
    if (     obj.truepos.x > W) { beams.splice(i-1, 1) }
    else if (obj.truepos.x < 0) { beams.splice(i-1, 1) }
    else if (obj.truepos.y > H) { beams.splice(i-1, 1) }
    else if (obj.truepos.y < 0) { beams.splice(i-1, 1) }
}

function checkCollision() {
  for (let i = 0; i < asteroids.length; i++) {
    if (asteroids[i].pos.dist(spaceship.pos) < asteroids[i].radius+10) {
      noLoop();
    }
  }
}
