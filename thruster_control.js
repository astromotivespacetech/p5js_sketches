function setup() {
  path = [];
  g = createVector(0, 1.64);
  fr = 60;
  dt = 1/fr;
  frameRate(fr);
  W = windowWidth;
  H = windowHeight;
  createCanvas(W, H);
  tar = createVector(W/2, H/2);
  bike = new Bike(createVector(W/3-100, H-150), createVector(200, 50));
  controller = new Controller(bike, tar);
}

function draw() {
  background(20);
  controller.update();
  bike.update();
  bike.draw();
  stroke(40);
  line(0,tar.y,W,tar.y);
  line(tar.x,0,tar.x,H);

  // // traces vehicle path
  // path.push(createVector(bike.pos.x+bike.size.x*0.5, bike.pos.y+bike.size.y*0.5));
  // noFill();
  // stroke(100,255,0,100);
  // beginShape();
  // for (let i = 0; i < path.length; i++) {
  //   vertex(path[i].x, path[i].y);
  // }
  // endShape();

}

function mouseClicked() {
  tar = createVector(mouseX, mouseY);
  controller.target_pos = tar.x-bike.size.x*0.5;
  controller.target_alt = tar.y-bike.size.y*0.5;
}

class Bike {

  constructor(pos, size) {
    this.pos = pos;
    this.vel = createVector();
    this.ang_vel = (1 - random()*2) * random(PI) * 0.001;
    this.orientation = (1 - random()*2) * PI/15;
    this.size = size;
    this.mass = 1500;
    this.I = 1/12 * this.mass * (this.size.x**2 + this.size.y**2);
    this.t1 = new Thruster(createVector(-15,25));
    this.t2 = new Thruster(createVector(this.size.x+15,25));
  }

  draw() {
    fill(255);
    noStroke();
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.orientation);
    rect(0, 0, this.size.x, this.size.y);
    this.t1.draw(this.t2);
    this.t2.draw(this.t1);
    pop();
  }


  update() {

    // compute thruster 1 force
    let f1 = createVector(0, -1);
    f1.rotate(this.t1.angle);
    f1.setMag(this.t1.thrust*this.t1.throttle);

    // compute thruster 2 force
    let f2 = createVector(0, -1);
    f2.rotate(this.t2.angle);
    f2.setMag(this.t2.thrust*this.t2.throttle);

    // compute thruster torques and angular acceleration
    let r = this.size.x * 0.5;
    let t1 = r * f1.mag() * sin( this.t1.angle + PI/2);
    let t2 = r * f2.mag() * sin( this.t2.angle - PI/2);
    let ang_accel = t1 / this.I;
    ang_accel += t2 / this.I;
    this.ang_vel += ang_accel * dt;
    this.orientation += this.ang_vel;

    // add forces to acceleration and implement integration
    let accel = createVector();
    accel.add(f1);
    accel.add(f2);
    accel.rotate(this.orientation);
    accel.div(this.mass);
    accel.add(g);
    accel.mult(dt);
    this.vel.add(accel);
    this.pos.add(this.vel);
  }

}


class Thruster {

  constructor(pos) {
    this.pos = pos;
    this.scale = 7;
    this.thrust = 2000; // N
    this.throttle = 1.0;
    this.angle = 0;
  }

  draw(t) {
    fill(255);
    noStroke();
    push();
    translate(this.pos);
    rotate(this.angle);
    beginShape();
    vertex(-1*this.scale, 0);
    vertex(1*this.scale, 0);
    vertex(1*this.scale, 2*this.scale);
    vertex(0.5*this.scale, 2.75*this.scale);
    vertex(1.75*this.scale, 5*this.scale);
    vertex(2.25*this.scale, 7*this.scale);
    vertex(-2.25*this.scale, 7*this.scale);
    vertex(-1.75*this.scale, 5*this.scale);
    vertex(-0.5*this.scale, 2.75*this.scale);
    vertex(-1*this.scale, 2*this.scale);
    endShape(CLOSE);
    drawArrow(createVector(0,7*this.scale), createVector(0,  this.throttle*100 + (this.throttle-t.throttle)*1000   ), 255);
    pop();
  }

}



class Controller {

  constructor(bike, t) {
    this.bike = bike;

    // target altitude control params
    this.target_alt = t.y-bike.size.y*0.5;
    this.error = this.bike.pos.y - this.target_alt;
    this.integral = 0;
    this.deriv = this.error - this.prev_error;
    this.KP = 0.035;
    this.KI = 0.00001;
    this.KD = 3;

    // target position control params
    this.target_pos = t.x-this.bike.size.x*0.5;
    this.perror = this.target_pos - bike.pos.x;
    this.pprev_error = this.perror;
    this.pintegral = 0;
    this.pderiv = 0;
    this.pKP = 0.005;
    this.pKI = 0;
    this.pKD = 1.5;

    // level orientation control params
    this.oerror = bike.orientation;
    this.oprev_error = this.oerror;
    this.ointegral = 0;
    this.oderiv = this.oerror - this.oprev_error;
    this.oKP = 0.05;
    this.oKI = 0;
    this.oKD = 1.50;
  }

  update() {

    // converge on horizontal target
    this.perror = this.target_pos - this.bike.pos.x;
    this.pintegral += this.perror;
    this.pderiv = this.perror - this.pprev_error;
    this.bike.t1.angle = this.pKP * this.perror + this.pKI * this.pintegral + this.pKD * this.pderiv;
    this.bike.t2.angle = this.pKP * this.perror + this.pKI * this.pintegral + this.pKD * this.pderiv;
    this.pprev_error = this.perror;

    // converge on altitude target
    this.error = this.bike.pos.y - this.target_alt;
    this.integral += this.error;
    this.deriv = this.error - this.prev_error;
    this.bike.t1.throttle = this.KP * this.error + this.KI * this.integral + this.KD * this.deriv;
    this.bike.t2.throttle = this.KP * this.error + this.KI * this.integral + this.KD * this.deriv;
    this.prev_error = this.error;

    // converge on level orientation
    this.oerror = this.bike.orientation;
    this.ointegral += this.oerror;
    this.oderiv = this.oerror - this.oprev_error;
    this.bike.t2.throttle += this.oKP * this.oerror + this.oKI * this.ointegral + this.oKD * this.oderiv;
    this.bike.t1.throttle -= this.oKP * this.oerror + this.oKI * this.ointegral + this.oKD * this.oderiv;
    this.oprev_error = this.oerror;

    // limit thruster gimbal angles
    if (this.bike.t1.angle > PI/4) { this.bike.t1.angle = PI/4 }
    if (this.bike.t2.angle > PI/4) { this.bike.t2.angle = PI/4 }
    if (this.bike.t1.angle < -PI/4) { this.bike.t1.angle = -PI/4 }
    if (this.bike.t2.angle < -PI/4) { this.bike.t2.angle = -PI/4 }

    // limit throttle between zero and one hundred percent
    if(this.bike.t1.throttle < 0) { this.bike.t1.throttle = 0; }
    if(this.bike.t2.throttle < 0) { this.bike.t2.throttle = 0; }
    if(this.bike.t1.throttle > 1.0) { this.bike.t1.throttle = 1.0; }
    if(this.bike.t2.throttle > 1.0) { this.bike.t2.throttle = 1.0; }
  }

}

function drawArrow(base, vec, myColor) {
  push();
  strokeWeight(3);
  stroke(myColor, myColor, 0, 100);
  fill(myColor, myColor, 0, 100);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
