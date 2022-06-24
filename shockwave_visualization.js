var Mach = 3;
var counter = 0;

function setup() {
  W = windowWidth;
  H = windowHeight;
  createCanvas(W, H);
  soundwaves = [];
  machNum = 1.0;
  b = new Ball( createVector(0,H/2), createVector(machNum*Mach,0));
}

function draw() {

  counter += 1;

  background(20);
  b.update();
  b.display();

  if (counter == 5) {
    opacity = 50;
    counter = 0;
  } else {
    opacity = 10;
  }

  sw = new SoundWave(createVector(b.pos.x, b.pos.y), opacity);
  soundwaves.push(sw);

  for (let i = soundwaves.length-1; i >= 0; i--) {
    soundwaves[i].update();
    if (soundwaves[i].radius > W) {
      soundwaves.splice(soundwaves[i], 1);
    } else {
      soundwaves[i].display();
    }
  }





}

class Ball {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  update() {
    this.pos.add(this.speed);
    if (this.pos.x > W) {
      this.pos.x = -W;
    }
  }

  display() {
    fill(255);
    circle(this.pos.x, this.pos.y, 10);
  }

}

class SoundWave {
  constructor(pos, op) {
    this.pos = pos;
    this.diameter = 0;
    this.opacity = op;
  }

  update() {
    this.diameter += Mach*2;
  }

  display() {
    noFill();
    stroke(255,255,255,this.opacity);
    circle(this.pos.x, this.pos.y, this.diameter);
  }

}
