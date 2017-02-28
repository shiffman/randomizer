function Disc(parent, position, rad) {
    this.parent = parent; // a PlinkoBoard object
    this.position = position;
    this.r = rad;
    this.velocity = createVector(0, 0);
    this.mass = 1;
    this.acceleration = createVector(0, 0);

    this.update = function () {
        this.applyForce(GRAVITY);
        //this.acceleration.y = 1;
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.checkCollisions();
    }
    this.hoverUpdate = function(){
        this.position.x = constrain(winMouseX,this.parent.position.x+(this.r),(this.parent.position.x+this.parent.size_width-(this.r)));
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
        
        // floor
        if (this.position.y > this.parent.floor_y) {
            this.velocity.y *= -0.5;
            this.velocity.x *= .9;
            if(this.velocity.x < 0.01){
                this.velocity.x = 0;
                foundWinner = true;
                winner = Math.floor(map(this.position.x-this.parent.position.x,0,this.parent.size_width,0,this.parent.names.length));
                startSimBtn.show();
                console.log(winner);
            }
            this.position.y = this.parent.floor_y;
        }
        
        for(var index = 0; index < this.parent.pegs.length; index++){
            var this_peg = this.parent.pegs[index];
            if(dist(this.position.x,this.position.y,this_peg.position.x,this_peg.position.y) < (this.r + this_peg.r-1)){
                var collisionPointX = ((this.position.x * this_peg.r) + (this_peg.position.x * this.r)) / (this.r + this_peg.r);
                var collisionPointY =  ((this.position.y * this_peg.r) + (this_peg.position.y * this.r))  / (this.r + this_peg.r);
                var normal_vect = createVector(collisionPointX-this_peg.position.x,collisionPointY-this_peg.position.y).normalize();
               // console.log(collisionPointX,collisionPointY,normal_vect);
                this.velocity = p5.Vector.add(p5.Vector.mult(p5.Vector.mult(normal_vect,p5.Vector.dot(this.velocity,normal_vect)),-2),this.velocity);//( -2*(V dot N)*N + V )
                this.velocity.mult(.5);
                this.position.x += this.velocity.x*1.15;
                this.position.y += this.velocity.y*1.15;
            }
        }
        
    };

}