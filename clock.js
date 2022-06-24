function setup() {
  W = windowWidth;
  H = windowHeight;
  createCanvas(W, H);
  time = new Time();
  clock1 = new Clock1(W*0.4, createVector(W*0.25,H/2), time);
  clock2 = new Clock2(W*0.4, createVector(W*0.75,H/2), time);
}

function draw() {
  background(20);
  clock1.update();
  clock1.draw();
  clock2.update();
  clock2.draw();
}


class Clock1 {
  constructor(d,p,t) {
    this.d = d;
    this.r = d/2;
    this.pos = p;
    this.hour = hour();
    if (this.hour > 12) { this.hour -= 12; }
    this.minute = minute();
    this.second = second();
  }

  update() {
    this.hour = hour();
    if (this.hour > 12) { this.hour -= 12; }
    this.minute = minute();
    this.second = second();
  }

  draw() {
    noFill();
    stroke(255);
    circle(this.pos.x, this.pos.y, this.d);

    for (let x = 0; x < 12; x++) {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(TWO_PI/12 * x);
      line(this.r, 0, this.r-20, 0);
      pop();
    }
    for (let x = 0; x < 60; x++) {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(TWO_PI/60 * x);
      line(this.r, 0, this.r-5, 0);
      pop();
    }

    let h = TWO_PI/12 * ( this.hour-3 );
    let m = TWO_PI/60 * ( this.minute-15 );
    let s = TWO_PI/60 * ( this.second-15 );

    // draw hour hand
    push();
    translate(this.pos.x, this.pos.y);
    rotate( h + (m/12) );
    line(0, 0, this.r*0.3, 0);
    pop();

    // draw minute hand
    push();
    translate(this.pos.x, this.pos.y);
    rotate( m + (s/60) );
    line(0, 0, this.r*0.6, 0);
    pop();

    // draw second hand
    push();
    translate(this.pos.x, this.pos.y);
    rotate( s );
    line(0, 0, this.r*0.8, 0);
    pop();

    strokeWeight(0);
    fill(255);
    textSize(14);
    textAlign(CENTER);
    text(this.hour, this.pos.x-50, this.pos.y+this.r+50);
    text(this.minute, this.pos.x, this.pos.y+this.r+50);
    text(this.second, this.pos.x+50, this.pos.y+this.r+50);

    strokeWeight(1);

  }
}


class Clock2 {
  constructor(d,p,t) {
    this.d = d;
    this.r = d/2;
    this.pos = p;
    this.t = t;
  }

  update() {
    this.t.calcTime();
  }

  draw() {
    noFill();
    stroke(255);
    circle(this.pos.x, this.pos.y, this.d);

    for (let x = 0; x < 10; x++) {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(-HALF_PI);
      rotate(TWO_PI/10 * x);
      line(this.r, 0, this.r-20, 0);
      pop();
    }
    for (let x = 0; x < 100; x++) {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(TWO_PI/100 * x);
      line(this.r, 0, this.r-5, 0);
      pop();
    }

    let t = TWO_PI/100 * ( this.t.ticks );
    let h = TWO_PI/10 * ( this.t.hectoticks );
    let k = TWO_PI/100 * ( this.t.kiloticks );

    // draw kilotick hand
    push();
    translate(this.pos.x, this.pos.y);
    rotate(-HALF_PI);
    rotate(k + (h/100) );
    line(0, 0, this.r*0.3, 0);
    pop();

    // draw hectotick hand
    push();
    translate(this.pos.x, this.pos.y);
    rotate(-HALF_PI);
    rotate(h + (t/10) );
    line(0, 0, this.r*0.6, 0);
    pop();

    // draw tick hand
    push();
    translate(this.pos.x, this.pos.y);
    rotate(-HALF_PI);
    rotate(t);
    line(0, 0, this.r*0.8, 0);
    pop();

    strokeWeight(0);
    fill(255);
    textSize(14);
    textAlign(CENTER);
    text(this.t.kiloticks, this.pos.x-50, this.pos.y+this.r+50);
    text(this.t.hectoticks, this.pos.x, this.pos.y+this.r+50);
    text(this.t.ticks, this.pos.x+50, this.pos.y+this.r+50);

    strokeWeight(1);

  }
}



class Time {

  constructor() {
    this.days = 1;
    this.hours = 24;
    this.minutes = this.hours * 60;
    this.seconds = this.minutes * 60;

    this.tick = this.days * 100000;      //  100000  `seconds` in a day
    this.hectotick = this.tick * 100;    //  1000  `minutes` in a day
    this.kilotick = this.tick * 1000;    //  100  `hours` in a day

    // a day is divided into 100 hours
    // an hour is divided into 10 minutes
    // a minute is divided into 100 seconds

    this.ratio = this.seconds/this.tick;

    this.secondcount = hour() * 3600 + minute() * 60 + second();
    console.log(this.secondcount);
    this.daypct = this.secondcount/this.seconds;
    console.log(this.daypct);

    this.ticks = this.secondcount / this.ratio;
    this.hectoticks = floor(this.ticks * 0.01);
    this.kiloticks = floor(this.ticks * 0.001);
    console.log(this.ticks);
    console.log(this.hectoticks);
    console.log(this.kiloticks);

  }

  calcTime() {
    this.secondscounter = this.secondcount + millis()*0.001;
    this.ticks = round(this.secondscounter / this.ratio);
    this.hectoticks = floor(this.ticks * 0.01);
    this.kiloticks = floor(this.ticks * 0.001);
    this.ticks = this.ticks - this.hectoticks*100;
    this.hectoticks = this.hectoticks - this.kiloticks*10;

    // console.log(this.kiloticks + " " + this.hectoticks + " " + this.ticks);
  }

}
