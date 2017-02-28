// Gravity Constant
var GRAVITY;
// Constant for a multiplier to try and ensure disc doesn't get stuck in obstacle
var ESC_VELOCITY_MULT = 1.06;
// has the ball been dropped?
var isDiscDropping = false;
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
var removeNameBtn;
// Hide the names before the ball has been dropped toggle
var hideNames = true;
function setup() {
    GRAVITY = createVector(0, .5); // init gravity
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
    // button for removing winner and restarting
    removeNameBtn = createButton("Remove & Restart");
    removeNameBtn.class('button');
    removeNameBtn.position(20, windowHeight - 40);
    removeNameBtn.mousePressed(removeName);
    removeNameBtn.hide();
    
    
    Board = new PlinkoBoard(createVector(50, 25), windowWidth - 100, windowHeight - 100);
    loadFirebase(initialize);
    textSize(15);
    textStyle(BOLD);
}

function draw() {
    background(20);
    Board.show();
    Board.update();
    if (isDiscDropping && loadAllDataFinished && foundWinner) {
        //Show the winner text
        textSize(35);
        fill(255);
        text("And the winner is...", width / 2 - 160, height / 2 - height / 4);
        textSize(55);
        fill(0);
        text(Board.names[winner], width / 2 - Board.names[winner].length * 16, height / 2 - height / 8);
    }
}

function initialize() {
    Board.setNames(names);
    //Everything is ready to go!
    loadAllDataFinished = true;
}

function mousePressed() {
    // if disc isn't moving already and mouse is outside board (hitting remove button)
    if (!isDiscDropping && (mouseY < Board.size_height+Board.position.y)) {
        startSimulation();
    }
}

function removeName() {
    if (isDiscDropping) {
        removeNameBtn.hide();
        Board = new PlinkoBoard(createVector(50, 25), windowWidth - 100, windowHeight - 100);
        loadAllDataFinished = false;
        isDiscDropping = false;
        foundWinner = false;
        names.splice(winner, 1);
        winner = null;
        initialize();
    }
}

function startSimulation() {
    //If the sketch is already "running" then reset all the variables
    if (isDiscDropping) {
        Board = new PlinkoBoard(createVector(50, 25), windowWidth - 100, windowHeight - 100);
        loadAllDataFinished = false;
        foundWinner = false;
        winner = null;
    }
    isDiscDropping = true;
}