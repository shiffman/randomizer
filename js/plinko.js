// Gravity Constant
var GRAVITY;
//Not really the sketch's speed, but the Cells speed
var sketch_speed;
// has the ball been dropped
var sketch_started = false;
//The user's input names
var names = [];
// the PlinkoBoard object that contains the pegs and discs
var Board;
//This will become true when everything is ready
var loadAllDataFinished = false;
var foundWinner = false;
//The winner name index
var winner = null;
//Start button
var startSimBtn;
// Hide the names before the ball has been dropped toggle
var hideNames = true;
function setup() {
    GRAVITY = createVector(0, .5);
    var config = {
        apiKey: "AIzaSyA-VyZJOZVqXZj82wvVMkfJedDEhqXcIh8"
        , authDomain: "a2zitp-6519b.firebaseapp.com"
        , databaseURL: "https://a2zitp-6519b.firebaseio.com"
        , storageBucket: "a2zitp-6519b.appspot.com"
        , messagingSenderId: "363965061200"
    };
    firebase.initializeApp(config);
    database = firebase.database();
    // Make the canvas full screen size
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    ellipseMode(CENTER);
    // Make a silly github thing
    var github = createA('https://github.com/shiffman/randomizer', '');
    var gitimg = createImg('https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png');
    gitimg.id('gitimg');
    github.child('gitimg');
    gitimg.attribute('style', 'position: absolute; top: 0; right: 0; border: 0;');
    startSimBtn = createButton("Remove Selected");
    startSimBtn.class('button');
    startSimBtn.position(20, windowHeight - 40);
    startSimBtn.mousePressed(removeName);
    startSimBtn.hide();
    Board = new PlinkoBoard(createVector(50, 25), windowWidth - 100, windowHeight - 100);
    loadFirebase(initialize);
    textSize(15);
    textStyle(BOLD);
}

function draw() {
    background(20);
    Board.show();
    Board.update();
    if (sketch_started) {
        if (loadAllDataFinished) {
            if (foundWinner) {
                //Show the winner text
                textSize(35);
                fill(255);
                text("And the winner is...", width / 2 - 160, height / 2 - height / 4);
                textSize(55);
                fill(0);
                text(Board.names[winner], width / 2 - Board.names[winner].length * 16, height / 2 - height / 8);
            }
        }
    }
}

function initialize() {
    Board.loadNames(names);
    //Everything is ready to go!
    loadAllDataFinished = true;
}

function mousePressed() {
    if (!sketch_started && (mouseY < Board.size_height+Board.position.y)) {
        startSimulation();
    }
    samePress = true;
}
function mouseReleased(){
    samePress = false;
}

function removeName() {
    if (sketch_started) {
        console.log("trying reset");
        startSimBtn.hide();
        Board = new PlinkoBoard(createVector(50, 25), windowWidth - 100, windowHeight - 100);
        loadAllDataFinished = false;
        sketch_started = false;
        foundWinner = false;
        names.splice(winner, 1);
        winner = null;
        initialize();
    }
}

function startSimulation() {
    console.log("StartSim");
    //If the sketch is already "running" then reset all the variables
    if (sketch_started) {
        Board = new PlinkoBoard(createVector(50, 25), windowWidth - 100, windowHeight - 100);
        loadAllDataFinished = false;
        foundWinner = false;
        winner = null;
    }
    sketch_speed = 1;
    sketch_started = true;
}