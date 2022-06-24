function setup() {
  H = windowHeight;
  W = windowWidth;
  createCanvas(W, H);
  graph = new Graph(fx);
  graph.compute();
}

function draw() {
  background(20);
  graph.display();
  stroke(100);
  line(W/2,0,W/2,H);
  line(0,H/2,W,H/2);
}

class Graph {

  constructor(e) {
    this.e = e;
    this.results = [];
    this.range = [];
    this.lower = -100;
    this.upper = 100;
    this.scaleFactor = 10;
  }

  compute() {
    for (let i = this.lower; i<=this.upper; i++) {
      for(let j = 0; j < 1; j=j+0.1) {
        this.results.push(this.e(i+j));
        this.range.push(i+j);
      }
    }
  }

  display() {
    push();
    translate(W/2,H/2);
    beginShape();
    for (let i = 1; i<this.results.length; i++) {
      stroke(255);
      line(this.range[i-1]*this.scaleFactor,-this.results[i-1]*this.scaleFactor,this.range[i]*this.scaleFactor,-this.results[i]*this.scaleFactor);
    }
    endShape();
    pop();
  }

}

function fx(x) {
  return x*sin(x/2);
}
