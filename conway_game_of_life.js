function setup() {
  Q = 500;
  q = 10;
  createCanvas(Q, Q);

  squares = [];

  for (i = 0; i < Q/q; i++) {
    for (j = 0; j < Q/q; j++) {

      if (random() > 0.8 ) {
        squares.push(new Square(createVector(q*i, q*j), q, 255));
      } else {
        squares.push(new Square(createVector(q*i, q*j), q, 0));
      }
    }
  }
}

function draw() {
  background(0);

  let flips = [];

  for (i = 0; i < 50; i++) {
    for (j = 0; j < 50; j++) {

      let count = 0;

      // right neighbor
      if (squares[j+(i+1)*50]) {
        if (squares[j+(i+1)*50].state == 255) { count++; }
      }

      // left neighbor
      if (squares[j+(i-1)*50]) {
        if (squares[j+(i-1)*50].state == 255) { count++; }
      }

      // top neighbor
      if (squares[(j-1)+i*50] && j>0) {
        if (squares[(j-1)+i*50].state == 255) { count++; }
      }

      // bottom neighbor
      if (squares[(j+1)+i*50] && j<49) {
        if (squares[(j+1)+i*50].state == 255) { count++; }
      }

      // top-left
      if (squares[(j-1)+(i-1)*50] && j>0) {
        if (squares[(j-1)+(i-1)*50].state == 255) { count++; }
      }

      // top-right
      if (squares[(j-1)+(i+1)*50] && j>0) {
        if (squares[(j-1)+(i+1)*50].state == 255) { count++; }
      }

      // bottom-left
      if (squares[(j+1)+(i-1)*50] && j<49) {
        if (squares[(j+1)+(i-1)*50].state == 255) { count++; }
      }

      // bottom-right
      if (squares[(j+1)+(i+1)*50] && j<49) {
        if (squares[(j+1)+(i+1)*50].state == 255) { count++; }
      }

      squares[j+i*50].display();

      if (squares[j+i*50].state == 255) {
        if (count < 2 || count > 3) {
          flips.push(j+i*50);
        }
      } else {
        if (count == 3) {
          flips.push(j+i*50);
        }
      }
    }
  }

  for (i = 0; i < flips.length; i++) {
    squares[flips[i]].flip();
  }
}

class Square {

  constructor(pos, size, state) {
    this.pos = pos;
    this.size = size;
    this.state = state;
  }

  flip() {
    this.state = this.state == 255 ? 0 : 255;
  }


  display() {
    fill(this.state);
    stroke(50);
    rect(this.pos.x, this.pos.y, this.size, this.size);
  }
}
