function PlinkoBoard(position, size_width, size_height) {
    this.position = position;
    this.size_height = size_height;
    this.size_width = size_width;
    this.names = [];
    this.pegs = [];
    this.discs = [];
    this.row_count = 14;
    this.col_count = 21;
    this.floor_y = this.position.y + this.size_height;
    this.names_width = size_width;
    
    for (var y = 0; y < this.row_count; y++) {
        for (var x = 0; x < this.col_count; x++) {
            var alt_row = (y % 2) == 0;
            var offset = (size_width / this.col_count) / 4;
            if (alt_row) {
                offset = offset + ((size_width / this.col_count) / 2);
            }
            if (y < this.row_count - 2) {
                this.pegs.push(new Peg(createVector(this.position.x + offset + (x * (this.size_width / this.col_count)), this.position.y + (y + 1) * (this.size_height / this.row_count)), 3));
            }
        }
    }
    this.update = function () {
            if (sketch_started && !foundWinner) {
                for (var i = 0; i < this.discs.length; i++) {
                    this.discs[i].update();
                }
            }
            else if(!foundWinner){
                if(this.discs.length > 0)
                    this.discs[0].hoverUpdate();
            }
        }
        //Show the board pegs and disc
    this.show = function () {
        fill(200);
        rect(this.position.x, this.position.y, this.size_width, this.size_height);
        for (var i = 0; i < this.discs.length; i++) {
            this.discs[i].show();
        }
        for (var j = 0; j < this.pegs.length; j++) {
            this.pegs[j].show();
        }
        for (var name_index = 0; name_index < this.names.length; name_index++) {
            var temp_x = this.position.x + ((name_index) * (this.names_width));
            var temp_y = this.position.y + this.size_height - (this.size_height / this.row_count);
            var text1 = this.names[name_index];
            if(hideNames && !sketch_started){
                text1 = "????";
            }
            text(text1, temp_x + (this.names_width / 2) - (text1.length*(15/4)), temp_y);
        }
    }
    this.shuffleNames = function () {
        var m = this.names.length
            , t, i;
        // While there remain elements to shuffle…
        while (m) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);
            // And swap it with the current element.
            t = this.names[m];
            this.names[m] = this.names[i];
            this.names[i] = t;
        }
    }
    
    this.loadNames = function (names) {
        this.discs[0] = (new Disc(this, createVector(this.position.x, this.position.y + 20), 20));
        this.names = names;
        this.names_width = this.size_width / names.length;
        this.shuffleNames();
        for (var name_index = 0; name_index < names.length - 1; name_index++) {
            this.pegs.push(new Peg(createVector(this.position.x + ((name_index + 1) * (this.names_width)), this.position.y + this.size_height - (this.size_height / this.row_count)), 6));
            this.pegs.push(new Peg(createVector(this.position.x + ((name_index + 1) * (this.names_width)), this.position.y + this.size_height - (this.size_height / this.row_count) / 2), 6));
            this.pegs.push(new Peg(createVector(this.position.x + ((name_index + 1) * (this.names_width)), this.position.y + this.size_height), 6));
            //this.pegs.push(new Peg(createVector(this.position.x + ((name_index+1) * (this.names_width)), this.position.y + this.size_height - (this.size_height/this.row_count)/5), 6));
        }
    }
}