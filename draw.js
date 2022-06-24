points = [];
var temp_line = null;
lines = [];

var temp_circle = null;
circles = [];

var mode = null;

function setup() {
  H = windowHeight;
  W = windowWidth;
  createCanvas(W, H);
  button_circle = new Button(createVector(0,H*0.1), H*0.05, 'circle');
  button_line   = new Button(createVector(0,H*0.15), H*0.05, 'line');
}

function draw() {
  background(20);

  button_circle.display(mode);
  button_line.display(mode);

  if (temp_circle) {
    temp_circle.radius = p5.Vector.dist(temp_circle.pos, createVector(mouseX, mouseY));
    temp_circle.draw();
  }
  if (temp_line) {
    temp_line.points[1] = createVector(mouseX, mouseY);
    temp_line.draw();
  }
  for (let i = 0; i < lines.length; i++) {
    lines[i].draw();
  }
  for (let i = 0; i < circles.length; i++) {
    circles[i].draw();
  }
}

function mouseClicked() {

  if (mouseX < button_circle.size && mouseY > button_circle.pos.y && mouseY < button_circle.pos.y + button_circle.size) {
    mode = 'circle';
  } else if (mouseX < button_line.size && mouseY > button_line.pos.y && mouseY < button_line.pos.y + button_line.size) {
    mode = 'line';
  } else {
    if (mode == 'circle') {
      if (temp_circle) {
        temp_circle.radius = p5.Vector.dist(temp_circle.pos, createVector(mouseX, mouseY));
        circles.push(temp_circle);
        temp_circle = null;
      } else {
        temp_circle = new Circle(createVector(mouseX, mouseY), 0);
      }
    } else if (mode == 'line') {
      if (temp_line) {
        temp_line.points[1] = createVector(mouseX, mouseY);
        lines.push(temp_line);
        temp_line = null;
      } else {
        temp_line = new Line([createVector(mouseX, mouseY), createVector(mouseX, mouseY)]);
      }
    }
  }

}

function get_type(obj) {
  switch(obj.type) {
    case 'circle':
      return ellipse(obj.pos.x+obj.size*0.5, obj.pos.y+obj.size*0.5, obj.size*0.5);
    case 'line':
      return line(obj.pos.x+obj.size*0.25, obj.pos.y+obj.size*0.25, obj.pos.x+obj.size*0.75, obj.pos.y+obj.size*0.75);
  }
}

class Button {

  constructor(pos, size, type) {
    this.pos = pos;
    this.size = size;
    this.type = type;
  }

  display(m) {
    if (m == this.type) {
      noStroke();
      fill(100);
    } else {
      noFill();
      strokeWeight(0.5);
      stroke(100);
    }
    rect(this.pos.x, this.pos.y, this.size, this.size);
    strokeWeight(1);
    stroke(255);
    get_type(this);
  }
}




class Line {

  constructor(points) {
    this.points = points;
  }

  draw() {
    noFill();
    strokeWeight(1);
    stroke(255);
    line(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y);
  }
}


class Circle {

  constructor(pos, r) {
    this.pos = pos;
    this.radius = r;
  }

  draw() {
    noFill();
    strokeWeight(1);
    stroke(255);
    ellipse(this.pos.x, this.pos.y, this.radius*2, this.radius*2);
  }
}

class Shape {

  constructor(size, pos) {
    this.size = size;
    this.pos = pos;
  }

  draw() {
    noFill();
    strokeWeight(1);
    stroke(255);
    rect(this.pos.x, this.pos.y, this.size.x, this.size.y);

  }

} 
