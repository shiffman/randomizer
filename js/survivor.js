//Not really the sketch's speed, but the Cells speed
var sketch_speed;
var sketch_started = false;

var foods = []; 
var cells = [];
//Foods to be created on the screen
var max_foods = 500;
//This will become true when everything is ready
var loadAllDataFinished = false;
var foundWinner = false;
//The winner Cell object 
var winner = null;
//The fade out speed of the alpha color of the dead Cell
var fadeOutSpeed = 4;

//Start button
var startSimBtn;
//Sketch speed input
var speedInput;

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

  // Make a silly github thing
  var github = createA('https://github.com/shiffman/randomizer', '');
  var gitimg = createImg('https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png');
  gitimg.id('gitimg');
  github.child('gitimg');
  gitimg.attribute('style', 'position: absolute; top: 0; right: 0; border: 0;');

  startSimBtn = createButton("Start");
  startSimBtn.class('button');
  startSimBtn.position(20, windowHeight - 40);
  startSimBtn.mousePressed(startSimulation);

  speedInput = createInput();
  speedInput.position(20, windowHeight - 70); 
  speedInput.value(1); 

  fill(255);
  text("Sketch speed (0 to 10): ", 20, windowHeight - 75);   
}

function draw(){  
	if(sketch_started){
		background(128, 157, 204);

		if(loadAllDataFinished){
			if(!foundWinner){
				//Show all the created foods 
				for(var i = 0; i < max_foods; i++)
					if(foods[i])
						foods[i].show();

				//Calculate the total deaths so we can detect the winner
				var deads = 0;
				//Winner
				var lastAlive = null;

				//Show and update all the cells
				for(var i = 0; i < cells.length; i++){
					cells[i].show();
					if(!cells[i].dead){
						cells[i].update(); 
						lastAlive = cells[i];
					}else{
						deads++;
						//Reduce the alpha of each dead Cell every frame
						if(cells[i].alpha > 0)
							cells[i].alpha -= fadeOutSpeed; 
					}
				}
				//If there's one Cell alive, we found the winner
				if(deads == cells.length - 1){
					foundWinner = true;
					winner = lastAlive;
				}
			}else{
				//Show the winner text
				textSize(35);
				fill(255);
				text("And the winner is...", width / 2 - 160, height / 2 - height/4);
				textSize(55);
				fill(0);
				text(winner.name + "!!", width / 2 - (winner.name + "!!").length*16, height / 2 - height/8);
			}
		}
		fill(255);
		textSize(12);
  		text("Sketch speed (0 to 10): ", 20, windowHeight - 75);  
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
  namesCreated();
}

function namesCreated(){
	//Create all the Food objects
	for(var i = 0; i < max_foods; i++)
		foods[i] = new Food(i);
	
	//Create all the Cell objects based on the names that the user entered
	for(var i = 0; i < names.length; i++)
		cells[i] = new Cell(names[i]);
	
	//Everything is ready to go!
	loadAllDataFinished = true;
}

function startSimulation(){
	//If the sketch is already "running" then reset all the variables
	if(sketch_started){
		cells = [];
		foods = [];
		loadAllDataFinished = false;
		foundWinner = false;
		winner = null;  
	}
	//Limit the sketch_speed to max 10
	sketch_speed = parseInt(speedInput.value());
	if(parseInt(speedInput.value()) > 10){
		speedInput.value(10);
		sketch_speed = 10;
	}

	sketch_started = true; 
	loadFirebase(createNames);
}