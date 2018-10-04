function Cell(name){
	this.name = name;
	this.dead = false;
	this.foodToEat = null;
	this.r = 40;
	this.speed = random(2.5, 3.5) + sketch_speed;
	this.pos = createVector(random(width - this.r), random(height - this.r));
	this.lastEatFood = this.r;
	this.alpha = 255;
	this.soundPlayed = false;
	this.maxEatTries = foods.length;

	this.update = function(){
		//Check if the Cell collied with another
		this.notCollidingWithCell();

		//Pick the nearest food if there's none
		if(this.foodToEat == null){
			this.foodToEat = this.pickFood();
		}else{
			//Go to Food's position, smoothly!
			this.pos = p5.Vector.lerp(this.pos, this.foodToEat.pos, this.speed * 0.1);
			//Eat the food if we collide with it
			if(dist(this.pos.x, this.pos.y, this.foodToEat.pos.x, this.foodToEat.pos.y) <= 1)
				//Eat the food
				this.eatFood(this.foodToEat);
		}
		//Change the size of the Cell smoothly
		this.r = lerp(this.r, this.lastEatFood, 0.7);
	}

	//Shwo the cell and the name
	this.show = function(){
		noStroke();
		fill(51, this.alpha);
		ellipse(this.pos.x, this.pos.y, this.r, this.r);
		fill(255, this.alpha);
		text(this.name, this.pos.x - this.name.length * 3.25, this.pos.y);

		//Play the "death?" sound only once
		// commenting out because it throws errors in chrome
		// if(this.dead){
		// 	if(!this.soundPlayed){
		// 		cellDiedSound.play();
		// 		this.soundPlayed = true;
		// 	}
		// }
	}

	//Check if we collide with a cell, if so, "kills" the smaller one.
	this.notCollidingWithCell = function(){
		for(var i = cells.length - 1; i >= 0; i--){
			if(cells[i] != this){
				//If the two Cells collide
				if(dist(this.pos.x, this.pos.y, cells[i].pos.x, cells[i].pos.y) <= this.r){
					//Kill the smaller Cell.
					//If each radius of the Cells are equal, kill one randomly
					if(this.r > cells[i].r){
						cells[i].dead = true;
					}else if(this.r < cells[i].r){
						this.dead = true;
					}else{
						if(round(random(0, 1)) == 0){
							cells[i].dead =  true;
						}else{
							this.dead = true;
						}
					}
				}
			}
		}
	}

	//Eats the food, increases its Cell size and destroys the Food object
	this.eatFood = function(food){
		this.lastEatFood += food.energy * 0.05;
		this.foodToEat = null;
		foods[food.index] = null;
	}

	//Finds and returns the nearest Food
	this.pickFood = function(){
		var minDistance = width + 30;
		var food;
		var backupFood;
		var currentEatTries = 0;

		//Run the 'find algorithm' until we find a food that is not picked by an another Cell object.
		while(food == null){
			//If the loop is stuck for a long frames, then return the last checked food
			if(currentEatTries >= this.maxEatTries){
				backupFood.picked = true;
				return backupFood;
			}
			for(var i = 0; i < foods.length; i++){
				if(foods[i] != null){
					backupFood = foods[i];
					//If the food is not already picked from another, check its distance with the Cell
					if(!foods[i].picked){
						var distance = dist(this.pos.x, this.pos.y, foods[i].pos.x, foods[i].pos.y);
						if(distance < minDistance){
							minDistance = distance;
							food = foods[i];
						}
					}
				}
				currentEatTries++;
			}
		}

		food.picked = true;
		return food;
	}
}
