var W, H;
var lines = [];
var num_lines = 5;
var elapsed = 0;

function setup() {
  W = windowWidth;
  H = windowHeight;
  createCanvas(W, H);
  for (let i = 0; i < num_lines; i++) {
    if (i==0) {
      width = W*0.7;
      height = H/2;
    } else {
      width = lines[i-1].x2;
      height = lines[i-1].y2;
    }
    length = random(1) * 100;
    angle = random(1) * PI;
    frequency = random(1) * 2 - 1;
    lines.push(new Line(width, height, length, angle, frequency));
  }

}

function draw() {
  background(20);
  stroke(30);
  line(0, H/2, W*0.4, H/2);
  stroke(40);
  line(W*0.4, 0, W*0.4, H);
  for (let i = 0; i < num_lines; i++) {
    if (i==0) {
      lines[i].update();
      if (i == num_lines-1) {
        lines[i].draw(1);
      } else {
        lines[i].draw();
      }
    } else if (i==num_lines-1) {
      lines[i].update(lines[i-1]);
      lines[i].draw(1);
    } else {
      lines[i].update(lines[i-1]);
      lines[i].draw();
    }
  }
  elapsed += 1;
}


class Line {

  constructor(x, y, l, theta, freq) {
    this.x1 = x;
    this.y1 = y;
    this.l = l;
    this.theta = theta;
    this.freq = freq;
    this.update();
    this.history = [];
    this.wave = [];
    this.color = [random(1) * 200, random(1) * 200, random(1) * 200];
  }

  update(parent) {
    let delta = PI * 2 / 60 * this.freq;
    let t = 0;
    if (parent) {
      this.x1 = parent.x2;
      this.y1 = parent.y2;
      t = parent.theta;
    }
    this.theta += delta;
    this.x2 = this.l * Math.sin(this.theta + t) + this.x1;
    this.y2 = this.l * Math.cos(this.theta + t) + this.y1;
  }

  draw(last) {
    if (last) {
      this.history.push(createVector(this.x2, this.y2));
      this.wave.push(createVector(elapsed, this.y2));
      if (this.history.length > 510) {
        this.history.splice(0, 1);
        this.wave.splice(0, 1);
      }
    }
    noFill();



    beginShape(LINES);
    for (let i = 0; i < this.history.length; i++) {
      let zero = elapsed - 255 * 2;
      if (zero > 0) { zero = 0 }
      let alpha = (i - zero) * 0.5;
      stroke(this.color[0], this.color[1], this.color[2], alpha);
      vertex(W*0.33 - elapsed + this.wave[i].x, this.wave[i].y);
      if (i>0) {
        vertex(W*0.33 - elapsed + this.wave[i-1].x, this.wave[i-1].y);
      }
   }
    endShape();

    beginShape(LINES);
    for (let i = 0; i < this.history.length; i++) {
      let zero = elapsed - 255 * 2;
      if (zero > 0) { zero = 0 }
      let alpha = (i - zero) * 0.5;
      stroke(this.color[0], this.color[1], this.color[2], alpha);
      vertex(this.history[i].x, this.history[i].y);
      if (i>0) {
        vertex(this.history[i-1].x, this.history[i-1].y);
      }
    }
    endShape();


    stroke(100);
    line(this.x1, this.y1, this.x2, this.y2);
  }
}
