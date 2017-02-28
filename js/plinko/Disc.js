// disc
function Disc(parent, position, rad) {
    // a PlinkoBoard object
    this.parent = parent;
    // position Pvector
    this.position = position;
    // radius
    this.r = rad;
    // velocity vector
    this.velocity = createVector(0, 0);
    // mass for nature of code patterns
    this.mass = 1;
    // current acceleration vector
    this.acceleration = createVector(0, 0);

    // update for actively falling disc
    this.update = function () {
        this.applyForce(GRAVITY);
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.checkCollisions();
    }
    
    // update for disc before being dropped
    this.hoverUpdate = function(){
        // follow mouse to the edges of the board with respect to radius
        this.position.x = constrain(winMouseX,this.parent.position.x+(this.r),(this.parent.position.x+this.parent.size_width-(this.r)));
        // don't let velocity get crazy
        this.velocity.x = constrain(this.position.x-pwinMouseX,-10,10);
    }

    //Show the disc
    this.show = function () {
        fill(color(220, 10, 10));
        stroke(color(255, 0, 0));
        ellipse(this.position.x, this.position.y, this.r * 2, this.r * 2);
        noStroke();
    }

    this.applyForce = function (force) {
        var f = p5.Vector.div(force, this.mass);
        this.acceleration.add(f);
    };

    this.checkCollisions = function () {
        // if hits right wall
        if (this.position.x > (this.parent.position.x+this.parent.size_width-(this.r))) {
            this.position.x = (this.parent.position.x+this.parent.size_width-(this.r));
            this.velocity.x *= -1;
        } else if (this.position.x < this.parent.position.x+(this.r)) { // left wall
            this.velocity.x *= -1;
            this.position.x = this.parent.position.x+(this.r);
        }
        
        // floor collision check
        if (this.position.y > this.parent.floor_y-this.r) {
            this.velocity.y *= -0.5; // bounce but slow down
            this.velocity.x *= 0.9; // slow for rolling friction
            
            // condition to set winner after disc slows enough
            if(this.velocity.x < 0.01){
                this.velocity.x = 0;
                this.parent.setWinner(this);
            }
            this.position.y = this.parent.floor_y-this.r+this.velocity.y*ESC_VELOCITY_MULT;
            this.position.x += this.velocity.x*ESC_VELOCITY_MULT;
        }
        
        // check pegs
        for(var index = 0; index < this.parent.pegs.length; index++){
            var this_peg = this.parent.pegs[index];
            if(dist(this.position.x,this.position.y,this_peg.position.x,this_peg.position.y) < (this.r + this_peg.r-1)){
                var collisionPointX = ((this.position.x * this_peg.r) + (this_peg.position.x * this.r)) / (this.r + this_peg.r);
                var collisionPointY =  ((this.position.y * this_peg.r) + (this_peg.position.y * this.r))  / (this.r + this_peg.r);
                var normal_vect = createVector(collisionPointX-this_peg.position.x,collisionPointY-this_peg.position.y).normalize();
                this.velocity = p5.Vector.add(p5.Vector.mult(p5.Vector.mult(normal_vect,p5.Vector.dot(this.velocity,normal_vect)),-2),this.velocity);//( -2*(V dot N)*N + V )
                this.velocity.mult(.5); // slow down
                
                this.position.x += this.velocity.x*ESC_VELOCITY_MULT;
                this.position.y += this.velocity.y*ESC_VELOCITY_MULT;
            }
        }
        
    };

}