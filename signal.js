var sines = [];

function setup() {
  H = windowHeight;
  W = windowWidth;
  top_line = H/4;
  middle_line = H/2;
  bottom_line = H/1.333;
  createCanvas(W, H);

  for (let i = 0; i < 4; i++) {
    freq = random() * 0.05;
    amp = floor(random() * 40) + 10;
    phase = random(TWO_PI);
    sines.push(new Sine(freq, amp, phase));
  }

  signal = new Signal(sines);

  resolution = 10;  // spacing between samples
  omega = 1;   // the sample error threshold
}

function draw() {
  background(20);

  stroke(255);
  strokeWeight(0.5);
  line(0, middle_line, W, middle_line);

  stroke(100);
  strokeWeight(0.25);
  line(0, top_line, W, top_line);
  line(0, bottom_line, W, bottom_line);

  signal.display();

  let sampled = [];
  for (let x = resolution; x < W; x += resolution) {

    // the y value of the signal at an x location
    let y = sample(signal, x);

    fill(255);
    noStroke();
    circle(x, y+top_line, 5);

    // vertical lines showing sampled points distance to center line
    noFill();
    stroke(100);
    strokeWeight(0.25);
    line(x, top_line, x, y+top_line);

    // push this point to the sampled array
    sampled.push(createVector(x, y));
  }

  let compressed = [];

  let spliced = true;

  while (spliced == true) {
    for (let i = 0; i < sampled.length; i++) {

      let count = 0;

      if (i+2 < sampled.length) {
        let midpoint_y = (sampled[i].y + sampled[i+2].y)/2;
        let true_y = sampled[i+1].y;
        let error = abs(true_y - midpoint_y);
        if (error > omega) {
          compressed.push(sampled[i+1]);
        } else {
          sampled.splice(i+1, 1);
          count += 1;
        }
      }

      if (count == 0) {
        spliced = false;
      }
    }
  }




  beginShape();

  for (let i = 0; i < compressed.length; i++) {
    noFill();
    stroke(255);
    strokeWeight(0.5);
    vertex(compressed[i].x, compressed[i].y+bottom_line);

    fill(255);
    noStroke();
    circle(compressed[i].x, compressed[i].y+bottom_line, 5);

    noFill();
    stroke(255);
    strokeWeight(0.5);
  }
  endShape();

  noLoop();

}


class Sine {

  constructor(freq, amp, phase) {
    this.freq = freq;
    this.amp = amp;
    this.phase = phase;
  }

  y(x) {
    return this.amp * sin(this.freq * (x + this.phase));
  }
}

class Signal {

  constructor(waves) {
    this.points = [];
    for (let x = 0; x < W; x++) {
      let y = 0;
      for (let i = 0; i < waves.length; i++) {
        y += waves[i].y(x);
      }
      this.points.push(createVector(x, y));
    }
    this.r = random()*255;
    this.g = random()*255;
    this.b = random()*255;
  }

  display() {
    noFill();
    strokeWeight(1);
    stroke(this.r,this.g,this.b);
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      vertex(this.points[i].x, this.points[i].y + top_line);
    }
    endShape();
  }
}


function sample(signal, x) {
  return signal.points[x].y;
}
