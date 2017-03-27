function Peg(position, rad){
    this.position = position;
    this.r = rad;
    this.mass = 10;
	
	this.update = function(){
		
	}

	//Shwo the cell and the name
	this.show = function(){
        fill(55);
        noStroke();
        ellipse(this.position.x,this.position.y,this.r*2,this.r*2);
	}
}
