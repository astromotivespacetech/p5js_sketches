function setup() {
  W = windowWidth;
  H = windowHeight;
  createCanvas(W, H);
  paddle = new Paddle();
  ball = new Ball();
}

function draw() {
  background(20);
  paddle.display();
  checkEdges(ball);
  checkPaddle(ball);
  ball.display();
}

function mouseMoved() {
  paddle.pos.x = mouseX - paddle.width/2;
  if (paddle.pos.x < 0) { paddle.pos.x = 0 }
  if (paddle.pos.x > W - paddle.width) { paddle.pos.x = W - paddle.width }
}


class Paddle {
  constructor() {
    this.width = W/10;
    this.pos = createVector(W/2 - this.width, H-20);
  }

  display() {
    fill(255);
    noStroke();
    rect(this.pos.x, this.pos.y, this.width, 20);
  }
}

class Ball {
  constructor() {
    this.radius = 15;
    this.pos = createVector(random(W), random(H));
    this.velocity = createVector(5, -5);
  }

  display() {
    fill(255);
    noStroke();
    this.pos.add(this.velocity);
    circle(this.pos.x, this.pos.y, this.radius);
  }
}

function checkEdges(obj) {
  if (obj.pos.x < obj.radius) {
    obj.velocity.x *= -1;
  }
  if (obj.pos.x > W-obj.radius) {
    obj.velocity.x *= -1;
  }
  if (obj.pos.y < obj.radius) {
    obj.velocity.y *= -1;
  }
  if (obj.pos.y > H-obj.radius) {
    noLoop();
  }
}

function checkPaddle(obj) {
  if (obj.pos.x > paddle.pos.x && obj.pos.x < paddle.pos.x + paddle.width && obj.pos.y >= paddle.pos.y) {

    if (obj.velocity.x > 0) {
      if (obj.pos.x > paddle.pos.x + paddle.width/2) {
        obj.velocity.y *= -1;
        pct = (obj.pos.x - (paddle.pos.x + paddle.width/2)) / (paddle.width/2);
        obj.velocity.x *= 1 + pct;
      } else {
        obj.velocity.mult(-1);
        pct = 1 - (obj.pos.x - paddle.pos.x) / (paddle.width/2);
        obj.velocity.x *= pct;
      }
    } else {
      if (obj.pos.x > paddle.pos.x + paddle.width/2) {
        obj.velocity.mult(-1);
        pct = 1-(obj.pos.x - (paddle.pos.x + paddle.width/2)) / (paddle.width/2);
        obj.velocity.x *= pct;
      } else {
        obj.velocity.y *= -1;
        pct = 1 - ((obj.pos.x - paddle.pos.x) / (paddle.width/2));
        obj.velocity.x *= 1 + pct;
      }
    }
  }
}
