cols = [];

function setup() {
  H = windowHeight;
  W = windowWidth;
  resolution = 15;
  num_rows = floor(H / resolution);
  num_cols = floor(W / resolution);

  createCanvas(num_cols*resolution, num_rows*resolution);

  for (i = 0; i < num_cols; i++) {
    row = [];
    for (j = 0; j < num_rows; j++) {
      let pos = createVector(i*resolution, j*resolution);
      row.push(new Point(i, j, pos, resolution));
    }
    cols.push(row);
  }
}

function draw() {
  background(20);

  new_cols = [];

  for (i = 0; i < num_cols; i++) {
    new_row = [];
    for (j = 0; j < num_rows; j++) {
      new_row.push(cols[i][j].update());
    }
    new_cols.push(new_row);
  }

  for (i = 0; i < num_cols; i++) {
    for (j = 0; j < num_rows; j++) {
      cols[i][j].temp += new_cols[i][j];
      if (cols[i][j].temp < 0) { cols[i][j].temp = 0; }
      if (cols[i][j].temp > 255) { cols[i][j].temp = 255; }
      cols[i][j].display();
    }
  }
}


function mouseMoved() {
  let i = floor(mouseX / resolution);
  let j = floor(mouseY / resolution);
  cols[i][j].temp = 255;
}


class Point {

  constructor(i, j, pos, res) {
    this.pos = pos;
    this.i = i;
    this.j = j;
    this.h = res;
    this.temp = 0;
  }

  update() {
    let new_temp = 0;
    if (this.i > 0 && this.j > 0 && this.i < num_cols-1 && this.j < num_rows-1) {
      for (let i = this.i-1; i <= this.i+1; i++) {
        for (let j = this.j-1; j <= this.j+1; j++) {
          if (this.temp > cols[i][j].temp) {
            new_temp -= abs(this.temp - cols[i][j].temp)*0.5 / 8;
          } else if (this.temp < cols[i][j].temp) {
            new_temp += abs(this.temp - cols[i][j].temp)*0.5 / 8;
          }
        }
      }
    } else {
      new_temp = -this.temp * 0.5 / 4;
    }
    return new_temp;
  }

  display() {
    // stroke(255);
    // strokeWeight(0.25);
    noStroke();
    fill(this.temp*2, this.temp**2 * 0.01, 0);
    rect(this.pos.x, this.pos.y, this.h, this.h);
  }
}
