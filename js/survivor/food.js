function Food(i){
	this.index = i;
	this.picked = false;
	this.color = color(random(255), random(150, 255), random(255), 190);
	this.energy = random(2, 40);
	this.pos = createVector(random(width - this.energy), random(height - this.energy));

	this.show = function(){
		fill(this.color);
		noStroke();
		rect(this.pos.x, this.pos.y, this.energy * 0.5, this.energy * 0.5);
	}
}
