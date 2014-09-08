
// The names
var names;
// Divs to hold names
var divs;

// Canvas for wheel
var canvas;

// Stuff for name input
var inputA;
var input;

// Size of circle
var w;

// Spin button
var button;

// Angle and speed
var angle;
var dangle = 0;

// Size of pie slice
var sz = 0;

// Total number of students
var total = 0;

// Entry state
var state = 0;

var spinning = false;

var mouseVec;
var pmouseVec;

function setup() {

  // Make the canvas full screen size
  canvas = createCanvas(windowWidth,windowHeight);
  canvas.position(0,0);

  // circle is 200 pixels less than height
  w = windowHeight-200;

  // Spin button
  button = createButton("spin the wheel");
  button.id('spin');
  button.position(20, windowHeight - 50);
  button.mousePressed(spinit);

  // Name input
  inputA = createA("#","Enter names");
  inputA.position(20,10);
  inputA.style("color","#FFFFFF");
  inputA.mousePressed(inputClick);
  input = createElement("textArea","1 per line\n2\n3\n4\n");
  input.position(8,10);
  input.attribute("rows",20);
  input.hide();

  // First pass at names
  createNames();

  // Random start to arrow
  angle = random(TWO_PI);
}

function draw() {
  
  // A user spin
  if (mouseIsPressed) {
    if (!mouseVec) {
      mouseVec = createVector();
      pmouseVec = createVector();
    }
    pmouseVec.set(mouseVec);
    mouseVec.x = mouseX - windowWidth / 2;
    mouseVec.y = mouseY - windowHeight / 2;
    if (mouseVec.mag() < w/2) {
      angle = mouseVec.heading();
    }
  }


  // clear background
  clear();
  strokeWeight(8);
  stroke(255);
  fill(190);
  translate(width/2, height/2);
  ellipse(0, 0, w, w);

  // For every slice
  for (var i = 0; i < total; i++) {
    push();
    // ALternate fill color
    if (i % 2 == 0) fill(175);
    else fill(75);

    // Where is the arrow?
    var testAngle = angle-sz/2;
    var begin = (i);
    var end = (i+1);
    
    // Which slice
    var which = (i+1)%total;

    // Is it inside the slice?
    if (spinning && ((testAngle >= begin*sz && testAngle < end*sz) || (testAngle < 0 && i == total-1))) {
      divs[which].style("background-color","#FFFFFF");
      divs[which].style("color","#000000");
    } else {
      divs[which].style("background-color","#000000");
      divs[(i+1) % total].style("color","#FFFFFF");
    }
    
    // Draw slice
    rotate(sz*i+sz/2);
    noStroke();
    arc(0, 0, w, w, 0, sz);
    pop();
  }
  
  // This is just some lines to separate the slices
  for (var i = 0; i < total; i++) {
    push();
    strokeWeight(2);
    stroke(255, 100);
    rotate(sz*i+sz/2);
    line(0, 0, w/2, 0);
    pop();
  }
  

  // The spinner
  rotate(angle);
  // Length
  var spinnerRad = 0.35*w;

  strokeWeight(8);
  stroke(255);
  line(-spinnerRad, 0, spinnerRad, 0);
  
  fill(255);
  // Arbitrary way to draw arrow
  triangle(spinnerRad, 0, spinnerRad - 24, -12, spinnerRad - 24, 12);
  // Back of spinner
  rect(-spinnerRad, -6, 12,12);
  // Center of spinner
  ellipse(0,0,12,12);

  // Spin
  angle += dangle;
  // Slow down to stop
  dangle *= 0.99;
  if (dangle < 0.001 && dangle > -0.001) dangle = 0;
  // Stay between 0 and 360
  if (angle > TWO_PI) {
    angle -= TWO_PI;
  }
  if (angle < 0) {
    angle += TWO_PI;
  }
}

// Make the divs that show the names
function createNames() {
  // INitial state
  if (!names) {
    names = [];
    for (var i = 0; i < 16; i++) {
      names[i] = String(i+1);
    }
  }


  total = names.length;
  sz = TWO_PI / total;   // Size of each slice
   
  // Clear existing divs
  if (divs) {
    for (var i = 0; i < divs.length; i++) {
      divs[i].remove();
    }
  }

  
  // Make new divs
  divs = [];
  var theta = 0;
  for (var i = 0; i < names.length; i++) {
    divs[i] = createDiv(names[i]);
    divs[i].style("color","#FFFFFF");
    divs[i].style("padding","10px");
    divs[i].style("display","inline-block");
    var cx = windowWidth/2;
    var cy = windowHeight/2;
    var r = w/2 + 60;
    var x = cx + r * cos(theta) - divs[i].elt.clientWidth/2;
    var y = cy + r * sin(theta) - divs[i].elt.clientHeight/2;
    divs[i].position(x,y);
    theta += sz;
  }
}

// Input link was clicked
function inputClick() {
  if (state === 0) {
    input.show();
    inputA.html("Submit names")
    inputA.position(10,280);
    state = 1;
  } else if (state === 1) {
    var data = input.value();
    names = data.split('\n');

    // If blank
    for (var i = names.length-1; i >= 0; i--) {
      names[i] = names[i].trim();
      if (names[i].length === 0) {
        names.splice(i,1);
      }
    }

    createNames();
    state = 0;
    inputA.html("Enter names");
    inputA.position(10,10);
    input.hide();
    spinning = false;
  }
}

function mouseReleased() {
  if (mouseVec.mag() < w/2) {
    var h1 = mouseVec.heading();
    var h2 = pmouseVec.heading();
    var mag = h1 - h2;
    mag = constrain(mag, -0.5, 0.5);
    spin(mag);
  }
}

function spinit() {
  spin(random(0.4,0.5));
}

// A random spin
function spin(force) {
  dangle = force;
  spinning = true;
}