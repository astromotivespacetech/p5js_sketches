function setup() {

  N = 500;
  size = 1;
  createCanvas(N*size, N*size);

  noise = [];


  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      noise.push(random());
    }
  }

  pn2 = generatePerlinNoise(noise, 2);
  pn3 = generatePerlinNoise(noise, 3);
  pn4 = generatePerlinNoise(noise, 4);
  pn5 = generatePerlinNoise(noise, 5);
  pn6 = generatePerlinNoise(noise, 6);
  pn7 = generatePerlinNoise(noise, 7);
  pn8 = generatePerlinNoise(noise, 8);
  pn9 = generatePerlinNoise(noise, 9);



}

function draw() {
  background(220);

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      noStroke();

      indx = IX(i,j,N);
      sum = pn2[indx] + pn3[indx] + pn4[indx] + pn5[indx] + pn6[indx] + pn7[indx] +
        pn8[indx] + pn9[indx];
      avg = sum / 8;
      fill(avg * 255);

      rect(i*size, j*size, size, size);
    }
  }

  noLoop();

}


function generateSmoothNoise(baseNoise, octave) {
  samplePeriod = 2 ** octave;
  sampleFrequency = 1 / samplePeriod;

  smooth = [];

  for (let i = 0; i < N; i++) {

    sample_i0 = floor(i / samplePeriod) * samplePeriod;
    sample_i1 = (sample_i0 + samplePeriod) % N;
    horizontal_blend = (i - sample_i0) * sampleFrequency;

    for (let j = 0; j < N; j++) {

      sample_j0 = floor(j / samplePeriod) * samplePeriod;
      sample_j1 = (sample_j0 + samplePeriod) % N;
      vertical_blend = (j - sample_j0) * sampleFrequency;

      t = Interpolate(baseNoise[IX(sample_i0,sample_j0,N)], baseNoise[IX(sample_i1,sample_j1,N)], horizontal_blend);

      b = Interpolate(baseNoise[IX(sample_i0,sample_j1,N)], baseNoise[IX(sample_i1,sample_j1,N)], horizontal_blend);

      smooth.push(Interpolate(t, b, vertical_blend));
    }
  }

  return smooth
}


function generatePerlinNoise(baseNoise, octaveCount) {

  persistence = 0.5;
  smoothNoise = [];


  for (let i = 0; i < octaveCount; i++) {
    smoothNoise.push(generateSmoothNoise(baseNoise, i));
  }

  perlinNoise = [];
  amplitude = 1;
  totalAmplitude = 0;

  for (let octave = octaveCount-1; octave > 0; octave--) {
    amplitude *= persistence;
    totalAmplitude += amplitude;

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        perlinNoise.push(smoothNoise[octave][IX(i,j,N)] * amplitude);
      }
    }
  }

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      perlinNoise[IX(i,j,N)] /= totalAmplitude;
    }
  }

  return perlinNoise;
}


function Interpolate(x0, x1, alpha) {
  return x0 * (1 - alpha) + alpha * x1;
}


function IX(x,y,N) {
  return x + y * N;
}
