particles = [];
cells = [];
numParticles = 1000;
g = 9.80665;
dt = 0.1;
df = 0.98;
r = 5;
size = 700;
N = 7;
X = size/N;
c = 50;



function setup() {
  W           = size;
  H           = size;
  createCanvas(W, H);

  
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      cells.push(new Cell(i, j, X));
    }
  }
  
  for (let i = 0; i < cells.length; i++) {
    cells[i].calculateNeighbors();
  }
    
  
  for (let i = 0; i < numParticles; i++) {
    let p = new Particle(createVector(random(width), random(height)), createVector(0,0), r);
    particles.push(p);
    const cellIndex = calculateCellIndex(p.pos, N);
    cells[cellIndex].particles.push(p);
  }
    
}

function draw() {
  background(220);
  
  for (i = 0; i < numParticles; i++) {
    particles[i].update();
    particles[i].checkCollision();
    particles[i].display();
  }
  
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      let index = i+j*N;
      cell = cells[index];
      for (const [idx, p] of cell.particles.entries()) {
        const cellIndex = calculateCellIndex(p.pos, N);
        if (cellIndex != index) {
          cell.particles.splice(idx, 1);
          cells[cellIndex].particles.push(p);
        }
      }
      cell.display();
    }
  }
}


class Particle {
  constructor(pos, vel, size) {
    this.pos = pos;
    this.vel = vel;
    this.size = size;
    this.cell = calculateCellIndex(pos, N);
  }
  
  update() {
    this.cell = calculateCellIndex(this.pos, N);
    let force = createVector();
    
    let i = cells[this.cell].i;
    let j = cells[this.cell].j;
    let neighbors = [];
    neighbors.push(...cells[this.cell].particles);
    let neighborcells = cells[this.cell].neighborcells;

    for (let i = 0; i < neighborcells.length; i++) {
      neighbors.push(...cells[neighborcells[i]].particles);
    }
    
    for (const p of neighbors) {
      let f = lennardJonesForce(this, p);      
      force.add(f);
    }

//     let gravity = createVector(0, g);
//     force.add(gravity);
    this.vel.add(force.mult(dt));    
    this.vel.limit(c);
    this.pos.add(p5.Vector.mult(this.vel, dt));
  }
  
  
  checkCollision() {
    if (this.pos.x < this.size*2) {
      this.pos.x = this.size*2+2;
      this.vel.x *= -1 * df;
    }
    if (this.pos.x > W-this.size*2) {
      this.pos.x = W-this.size*2-2;
      this.vel.x *= -1 * df;
    }
    if (this.pos.y < this.size*2) {
      this.pos.y = this.size*2+2;
      this.vel.y *= -1 * df;
    }
    if (this.pos.y > H-this.size*2) {
      this.pos.y = H-this.size*2-2;
      this.vel.y *= -1 * df;
    }
    
  }
  
  display() {
    noStroke();
    fill(0, 155, 255);
    circle(this.pos.x, this.pos.y, this.size);
  }
}


function lennardJonesForce(p1, p2) {
    let mag = p1.pos.dist(p2.pos);

    if (r === 0) {
        const v = createVector(0, 0);
        return v;
    }

    let v = p5.Vector.sub(p1.pos, p2.pos);  
  
    let target = r*10;

    if (mag <= target) {
      v.setMag((target-mag)**2 * 0.01);
    } else {
      // v.mult(-1);
      // v.setMag(1/mag);
       v.setMag(0);
    }
    return v;
}




class Cell {
  constructor(i, j, size) {
    this.i = i;
    this.j = j;
    this.index = i + j * N;
    this.size = size;
    this.particles = [];
    this.neighborcells = [];
  }
  
  calculateNeighbors() {
    const ni = this.i;
    const nj = this.j;

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        const neighborI = ni + xOffset;
        const neighborJ = nj + yOffset;

        if (isValidCellIndex(neighborI, neighborJ, N)) {
          const neighborIndex = neighborI + neighborJ * N;
          // Avoid adding the current cell itself to its neighbors
          if (neighborIndex !== this.index) {
            this.neighborcells.push(neighborIndex);
          }
        }
      }
    }
  }
  
  display() {
    noFill();
    stroke(150);
    rect(this.i*X, this.j*X, this.size,this.size);
  }
}


function calculateCellIndex(pos, gridSize) {
    const gridX = Math.floor(pos.x / X); 
    const gridY = Math.floor(pos.y / X); 
    const clampedGridX = Math.max(0, Math.min(gridX, gridSize - 1));
    const clampedGridY = Math.max(0, Math.min(gridY, gridSize - 1));
    const cellIndex = clampedGridY * N + clampedGridX;

    return cellIndex;
}




function isValidCellIndex(i, j, gridSize) {
    return i >= 0 && i < gridSize && j >= 0 && j < gridSize;
}

function IX(i,j) {
  return i + j * N;
}
