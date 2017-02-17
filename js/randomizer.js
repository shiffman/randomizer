
// The names
var names = [];
// Divs to hold names
var divs;

var selected;

// Canvas for wheel
var canvas;

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

var removeButton;

var nameColors = [];
var database;

function setup() {

  var config = {
    apiKey: "AIzaSyA-VyZJOZVqXZj82wvVMkfJedDEhqXcIh8",
    authDomain: "a2zitp-6519b.firebaseapp.com",
    databaseURL: "https://a2zitp-6519b.firebaseio.com",
    storageBucket: "a2zitp-6519b.appspot.com",
    messagingSenderId: "363965061200"
  };
  firebase.initializeApp(config);
  database = firebase.database();


  // Make the canvas full screen size
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);

  // circle is 200 pixels less than height
  w = windowHeight - 200;

  // Spin button
  button = createButton("spin the wheel");
  button.class('button');
  button.position(20, windowHeight - 50);
  button.mousePressed(spinit);

  removeButton = createButton('remove selected');
  removeButton.class('button');
  removeButton.mousePressed(removeName);
  removeButton.position(20, windowHeight - 80)

  // Make a silly github thing
  var github = createA('https://github.com/shiffman/randomizer', '');
  var gitimg = createImg('https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png');
  gitimg.id('gitimg');
  github.child('gitimg');
  gitimg.attribute('style', 'position: absolute; top: 0; right: 0; border: 0;');


  // Random start to arrow
  angle = random(TWO_PI);


  loadFirebase(createNames);
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
    if (mouseVec.mag() < w / 2) {
      angle = mouseVec.heading();
    }
  }


  // clear background
  clear();
  strokeWeight(8);
  stroke(255);
  fill(190);
  translate(width / 2, height / 2);
  ellipse(0, 0, w, w);

  // For every slice
  for (var i = 0; i < total; i++) {
    push();
    // ALternate fill color
    

    // Where is the arrow?
    var testAngle = angle - sz / 2;
    var begin = (i);
    var end = (i + 1);

    // Which slice
    var which = (i + 1) % total;
	var insideSlice = false;

    // Is it inside the slice?
    if (((testAngle >= begin * sz && testAngle < end * sz) || (testAngle < 0 && i == total - 1))) {
      selected = which;
      divs[which].style("background-color", "#FFFFFF");
      divs[which].style("color", "#000000");
	  insideSlice = true;
    } else {
      divs[which].style("background-color", "#000000");
      divs[(i + 1) % total].style("color", "#FFFFFF");	  
    }

    // Draw slice
    rotate(sz * i + sz / 2);
    noStroke();
	
	//Change the color and the size of the slice that the pointer is inside
	if(insideSlice){
		fill(nameColors[i].rgba[0], nameColors[i].rgba[1], nameColors[i].rgba[2], 190);		
		arc(0, 0, w+30, w+30, 0, sz); 
	}else{
		fill(nameColors[i]); 
		arc(0, 0, w, w, 0, sz); 
	}
    
    pop();
	
	// This is just some lines to separate the slices
    push();
		//Change the border color of the slide that the poiner is inside
		//to achive the illusion that the slice is pulled up
		if(!insideSlice){
			stroke(255, 100);
			strokeWeight(2); 
		}else{
			stroke(51);
			strokeWeight(2.5); 
		}
		rotate(sz * i + sz / 2);
		line(0, 0, w / 2, 0);
    pop();
  } 
  
  // The spinner
  rotate(angle);
  // Length
  var spinnerRad = 0.35 * w;

  strokeWeight(8);
  stroke(255);
  line(-spinnerRad, 0, spinnerRad, 0);

  fill(255);
  // Arbitrary way to draw arrow
  triangle(spinnerRad, 0, spinnerRad - 24, -12, spinnerRad - 24, 12);
  // Back of spinner
  rect(-spinnerRad, -6, 12, 12);
  // Center of spinner
  ellipse(0, 0, 12, 12);

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
      names[i] = String(i + 1);
    }
  }

  createDivs();
}



function createDivs() {


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
    divs[i].style("color", "#FFFFFF");
    divs[i].style("padding", "10px");
    divs[i].style("display", "inline-block");
    var cx = windowWidth / 2;
    var cy = windowHeight / 2;
    var r = w / 2 + 60;
    var x = cx + r * cos(theta) - divs[i].elt.clientWidth / 2;
    var y = cy + r * sin(theta) - divs[i].elt.clientHeight / 2;
    divs[i].position(x, y);
    theta += sz;
  }

  loadColors();
}

function mouseReleased() {
  if (mouseVec.mag() < w / 2) {
    var h1 = mouseVec.heading();
    var h2 = pmouseVec.heading();
    var mag = h1 - h2;
    mag = constrain(mag, -0.5, 0.5);
    spin(mag);
  }
}

function keyPressed() {
  if (key == ' ') {
    spinit();
  }
}

function removeName() {
  names.splice(selected, 1);
  createNames();
}

function spinit() {

  var force = random(0.4, 0.5);
  if (random(1) < 0.5) {
    force *= -1;
  }

  spin(force);
}

// A random spin
function spin(force) {
  dangle = force;
  spinning = true;
}

function loadColors() {
  // TODO: set better colors with RGB
  var rainbowColors = [
    createVector(0, 0, 0).set(color('red').rgba),
    createVector(0, 0, 0).set(color('orange').rgba),
    createVector(0, 0, 0).set(color('yellow').rgba),
    createVector(0, 0, 0).set(color('green').rgba),
    createVector(38, 58, 150), // blue
    createVector(0, 0, 0).set(color('indigo').rgba),
    createVector(0, 0, 0).set(color('violet').rgba)
  ];

  for (var i = 0; i < total; i++) {
    var colorPosition = i / total;
    var scaledColorPosition = colorPosition * (rainbowColors.length - 1);

    var colorIndex = Math.floor(scaledColorPosition);
    var colorPercentage = scaledColorPosition - colorIndex;

    var nameColor = getColorByPercentage(rainbowColors[colorIndex],
      rainbowColors[colorIndex + 1],
      colorPercentage);

    nameColors.push(color(nameColor.x, nameColor.y, nameColor.z))
  }
}

function getColorByPercentage(firstColor, secondColor, percentage) {
  // assumes colors are p5js vectors
  var firstColorCopy = firstColor.copy();
  var secondColorCopy = secondColor.copy();

  var deltaColor = secondColorCopy.sub(firstColorCopy);
  var scaledDeltaColor = deltaColor.mult(percentage);
  return firstColorCopy.add(scaledDeltaColor);
}
