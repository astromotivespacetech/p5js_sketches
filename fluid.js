var N = 64;
var SCALE = 10;
var iter = 1;
var t = 0;

function setup() {
  createCanvas(N*SCALE, N*SCALE);
  console.log(windowWidth);
  fluid = new Fluid(0.1, 0, 0);
}

function draw() {
  background(0);
  fluid.addDye(N/2, N/2, 255);
  let angle = noise(t) * TWO_PI;
  let vector = p5.Vector.fromAngle(angle);
  vector.mult(0.5);
  let amtX = vector.x;
  let amtY = vector.y;
  t += 0.1;
  fluid.addVelocity(N/2, N/2, amtX, amtY);
  fluid.step();
  fluid.render();
  fluid.fade();
}

class Fluid {

  constructor(dt, visc, diff) {
    this.size = N;
    this.dt = dt;
    this.diff = diff;
    this.visc = visc;
    this.s = [];
    this.density = [];
    this.Vx = [];
    this.Vy = [];
    this.Vx0 = [];
    this.Vy0 = [];
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        this.s.push(0);
        this.density.push(0);
        this.Vx.push(0);
        this.Vy.push(0);
        this.Vx0.push(0);
        this.Vy0.push(0);
      }
    }
  }

  step() {
    diffuse(1, this.Vx0, this.Vx, this.visc, this.dt);
    diffuse(2, this.Vy0, this.Vy, this.visc, this.dt);

    project(this.Vx0, this.Vy0, this.Vx, this.Vy);

    advect(1, this.Vx, this.Vx0, this.Vx0, this.Vy0, this.dt);
    advect(2, this.Vy, this.Vy0, this.Vx0, this.Vy0, this.dt);

    project(this.Vx, this.Vy, this.Vx0, this.Vy0);

    diffuse(0, this.s, this.density, this.diff, this.dt);
    advect(0, this.density, this.s, this.Vx, this.Vy, this.dt);
  }

  addDye(x, y, amount) {
    let index = IX(x, y);
    this.density[index] += amount;
  }

  addVelocity(x, y, amountX, amountY) {
    let index = IX(x, y);
    this.Vx[index] += amountX;
    this.Vy[index] += amountY;
  }

  render() {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        let x = i*SCALE;
        let y = j*SCALE;
        let d = this.density[IX(i, j)];
        fill(255, d);
        noStroke();
        square(x, y, SCALE);
      }
    }
  }

  fade() {
    for (let i = 0; i < this.density.length; i++) {
      let d = this.density[i];
      this.density[i] = constrain(d-0.1, 0, 255);
    }
  }

}


function diffuse(b, x, x0, diff, dt) {
  let a = dt * diff * (N-2) * (N-2);
  lin_solve(b, x, x0, a, 1+6*a);
}

function lin_solve(b, x, x0 , a, c) {
  let cRecip = 1/c;
  for (let k = 0; k < iter; k++) {
    for (let j = 1; j < N-1; j++) {
      for (let i = 1; i < N-1; i++) {
        x[IX(i,j)] = x0[IX(i, j)] + a * (x[IX(i+1, j)] + x[IX(i-1, j)] + x[IX(i  , j+1)] + x[IX(i  , j-1)]) * cRecip;
      }
    }
  }
  set_bnd(b, x);
}

function project(velocX, velocY, p, div) {
  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      div[IX(i,j)] = -0.5*(velocX[IX(i+1, j)]-velocX[IX(i-1, j)]+velocY[IX(i  , j+1)]-velocY[IX(i  , j-1)])/N;
      p[IX(i, j)] = 0;
    }
  }
  set_bnd(0, div);
  set_bnd(0, p);
  lin_solve(0, p, div, 1, 6);

  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {
      velocX[IX(i, j)] -= 0.5 * (p[IX(i+1, j)]   - p[IX(i-1, j)])   * N;
      velocY[IX(i, j)] -= 0.5 * (p[IX(i  , j+1)] - p[IX(i  , j-1)]) * N;
    }
  }
  set_bnd(1, velocX);
  set_bnd(2, velocY);
}

function advect(b, d, d0, velocX, velocY, dt) {
  let dtx = dt * (N-2);
  let dty = dt * (N-2);
  let Nfloat = N;

  for (let j = 1; j < N-1; j++) {
    for (let i = 1; i < N-1; i++) {

      tmp1 = dtx * velocX[IX(i, j)];
      tmp2 = dty * velocY[IX(i, j)];
      x = i - tmp1;
      y = j - tmp2;

      if (x < 0.5) { x = 0.5; }
      if (x > N + 0.5) { x = N + 0.5; }
      let i0 = floor(x);
      let i1 = i0 + 1;

      if (y < 0.5) { y = 0.5; }
      if (y > N + 0.5) { y = N + 0.5; }
      let j0 = floor(y);
      let j1 = j0 + 1;

      let s1 = x - i0;
      let s0 = 1 - s1;
      let t1 = y - j0;
      let t0 = 1 - t1;

      let i0i = i0;
      let i1i = i1;
      let j0i = j0;
      let j1i = j1;

      d[IX(i, j)] =
        s0 * ( t0 * d0[IX(i0i, j0i)] + t1 * d0[IX(i0i, j1i)]) +
        s1 * ( t0 * d0[IX(i1i, j0i)] + t1 * d0[IX(i1i, j1i)]);
    }
  }
  set_bnd(b, d);
}

function set_bnd(b, x) {

      for(let i = 1; i < N - 1; i++) {
          x[IX(i, 0)] = b == 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
          x[IX(i, N-1)] = b == 2 ? -x[IX(i, N-2)] : x[IX(i, N-2)];
      }

      for(let j = 1; j < N - 1; j++) {
          x[IX(0  , j)] = b == 1 ? -x[IX(1  , j)] : x[IX(1  , j)];
          x[IX(N-1, j)] = b == 1 ? -x[IX(N-2, j)] : x[IX(N-2, j)];
      }


    x[IX(0, 0)]       = 0.5 * (x[IX(1, 0)] + x[IX(0, 1)]);
    x[IX(0, N-1)]     = 0.5 * (x[IX(1, N-1)] + x[IX(0, N-2)]);
    x[IX(N-1, 0)]     = 0.5 * (x[IX(N-2, 0)] + x[IX(N-1, 1)]);
    x[IX(N-1, N-1)]   = 0.5 * (x[IX(N-2, N-1)] + x[IX(N-1, N-2)]);

}


function IX(x, y) {
  return x + y * N;
}
