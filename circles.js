function setup() {

  W      = windowWidth;
  H      = windowHeight;
  createCanvas(W, H);
  x_hat  = createVector(-1, 0);
  lever1 = 15;
  lever2 = 100;
  c1     = new Circle(createVector(0, 0), lever1);
  c2     = new Circle(createVector(-100,-50), 150);

}

function draw() {

  background(20);
  push();
  translate(W/2, H/2);
  stroke(50);
  strokeWeight(1);
  line(-W/2, 0, W/2, 0);
  line(0, -H/2, 0, H/2);
  l1       = createVector(mouseX - W/2, mouseY - H/2);
  l1.setMag(c1.r);
  stroke(255);
  line(c1.pos.x, c1.pos.y, l1.x, l1.y);
  c3       = new Circle(l1, lever2, 0);
  points   = calcIntersectionPoints(c2, c3);

  if (points) {

    stroke(255);
    line(c3.pos.x, c3.pos.y, points[0].x, points[0].y);
    h      = sqrt( (points[0].x - c2.pos.x)**2 + (points[0].y - c2.pos.y)**2 );
    b      = 50;
    a      = sqrt( h**2 - b**2 );
    hyp    = p5.Vector.sub(points[0], c2.pos);
    v      = createVector(0, a);
    angle1 = asin(b / h);
    angle2 = v.angleBetween(hyp);
    v.rotate(angle1+angle2);
    line(c2.pos.x, c2.pos.y, c2.pos.x + v.x*2, c2.pos.y + v.y*2);
    line(c2.pos.x + v.x, c2.pos.y + v.y, points[0].x, points[0].y);

  }

  c1.draw();
  c2.draw();
  c3.draw();
  stroke(255);
  text( round(degrees(l1.angleBetween(x_hat))*10)/10 + "°" , c1.pos.x, c1.pos.y - 30);
  text( round(degrees(angle1+angle2)*10)/10 + "°" , c2.pos.x, c2.pos.y - 30);
  pop();

}

function mouseClicked() {

  c2.pos = createVector(mouseX - W/2, mouseY - H/2);

}

class Circle {

  constructor(pos, r) {

    this.pos = pos;
    this.r   = r;

  }

  draw() {

    noFill();
    stroke(30);
    strokeWeight(1);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);

  }

}

function calcIntersectionPoints(A, B) {

  d     = sqrt((B.pos.x - A.pos.x)**2 + (B.pos.y - A.pos.y)**2);

  if (d <= A.r + B.r && d >= abs(B.r - A.r)) {

    ex  = (B.pos.x - A.pos.x) / d;
    ey  = (B.pos.y - A.pos.y) / d;
    x   = (A.r * A.r - B.r * B.r + d * d) / (2 * d);
    y   = sqrt(A.r * A.r - x * x);
    p1x = A.pos.x + x * ex - y * ey;
    p1y = A.pos.y + x * ey + y * ex;
    p2x = A.pos.x + x * ex + y * ey;
    p2y = A.pos.y + x * ey - y * ex;
    P1  = createVector(p1x, p1y);
    P2  = createVector(p2x, p2y);

    return [P1, P2];

  } else {

    return null;

  }

}
