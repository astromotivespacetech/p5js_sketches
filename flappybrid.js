var walls = [];
var score = 0;
var speed = 4;

function setup() {
  W = windowWidth;
  H = windowHeight;
  createCanvas(W, H);
  g = createVector(0, 0.25);
  bird = new Bird();
  walls.push(new Wall(W*0.7));
  walls.push(new Wall(W*1.4));
  walls.push(new Wall(W*2.1));
}

function draw() {
  background(20);
  textSize(12);
  fill(255);
  text('Score: ' + score, 10, 30);
  if (millis() > 1000) {

    for (i = walls.length-1; i >= 0; i--) {
      walls[i].draw();
      if (walls[i].pos.x < bird.pos.x && walls[i].passed == false) {
        walls[i].passed = true;
        score += 1;
        speed += 0.1;
      }
      if (walls[i].pos.x < -50) {
        walls.splice(i, 1);
        walls.push(new Wall(W*2.1));
      }
      if (i == 0) {
        bird.checkCollision(walls[i]);
      }
    }
    bird.checkBottom();
    bird.draw();
  }
}

function keyPressed() {
  if (keyCode == 32) {
    if (bird.vel.y > 0) {
      bird.vel.y = -5;
    } else {
      bird.vel.y -= 5;
    }
  }
}

class Bird {
  constructor() {
    this.pos = createVector(W*0.2, H/2);
    this.vel = createVector();
  }

  draw() {
    this.vel.add(g);
    this.pos.add(this.vel);
    fill(255);
    noStroke();
    circle(this.pos.x, this.pos.y, 24);
  }

  checkBottom() {
    if (this.pos.y > H-24) {
      this.pos.y = H-24;
      noLoop();
    }
    if (this.pos.y <= 12) {
      this.pos.y = 12;
      this.vel.y = 0;
    }
  }

  checkCollision(wall) {
    // check x location
    if (bird.pos.x >= wall.pos.x-12 && bird.pos.x <= wall.pos.x + 50) {
      //check gap
      if (bird.pos.y <= wall.height+12 || bird.pos.y >= wall.height+wall.gap-24) {
        noLoop();
      }
    }
  }

}


class Wall {
  constructor(x) {
    this.pos = createVector(x, 0);
    this.height = random(H*0.1, H*0.7);
    this.gap = random(H*0.15, H*0.35);
    this.passed = false;
  }

  draw() {
    this.pos.x -= speed;
    fill(255);
    noStroke();
    rect(this.pos.x, this.pos.y, 50, this.height);
    rect(this.pos.x, this.height+this.gap, 50, H-this.height+this.gap);
  }
}
