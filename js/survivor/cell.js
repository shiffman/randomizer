function Cell(name){
	this.name = name;
	this.dead = false;
	this.foodToEat = null; 
	this.r = 40; 
	this.speed = 2.5 + sketch_speed;
	this.pos = createVector(random(width - this.r), random(height - this.r));
	this.lastEatFood = this.r;
	this.alpha = 255; 

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
		text(this.name, this.pos.x - this.name.length * 3, this.pos.y);
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
						if(random(0, 2) == 0){
							cells[i].dead =  true;
						}else{
							this.dead = true;
						}
					}
				}
			}
		}
	} 

	//Eats the food, increases its Cell size and destroy the food object
	this.eatFood = function(food){ 
		this.lastEatFood += food.energy * 0.05;
		this.foodToEat = null;
		foods[food.index] = null;
	}

	//Picks the nearest Food
	this.pickFood = function(){
		var minDistance = width + 30;
		var food;
		for(var i = 0; i < foods.length; i++){
			if(foods[i] != null){
				//If the food is not already picked from another, check its distance with the Cell
				if(!foods[i].picked){
					var distance = dist(this.pos.x, this.pos.y, foods[i].pos.x, foods[i].pos.y);
					if(distance < minDistance){
						minDistance = distance;
						food = foods[i]; 
					}
				}
			}
		}

		//Re-call this function the selected food, is already picked
		if(food == null){
			this.pickFood();
		}else{
			food.picked = true;
			return food;
		}
	}
}