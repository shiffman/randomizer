function PlinkoBoard(position, size_width, size_height) {
    // The position of the top right corner of this PlinkoBoard instance
    this.position = position;
    // The width of this PlinkoBoard instance
    this.size_width = size_width;
    // The height of this PlinkoBoard instance
    this.size_height = size_height;
    // An array of names retrieved from firebase (The user input to be randomly choosen from, some items may have been removed by the user, use the 'names' global for a unaltered firebase result)
    this.names = [];
    // An array of Peg objects that are obstacles for the discs
    this.pegs = [];
    // An array of Disc objects
    this.discs = [];
    // The number of Pegs along the Y axis
    this.row_count = 14;
    // The number of Pegs along the X axis
    this.col_count = 21;
    // The global y position of the bottom of the PlinkoBoard
    this.floor_y = this.position.y + this.size_height;
    // The x width of each container at the bottom (initialize to complete width)
    this.names_width = size_width;
    // Generate Pegs
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
        // if ball has been dropped
            if (isDiscDropping && !foundWinner) {
                for (var i = 0; i < this.discs.length; i++) {
                    this.discs[i].update();
                }
            }
            else if (!foundWinner) {
                if (this.discs.length > 0) 
                    this.discs[0].hoverUpdate();
            }
        }
        //Show the board pegs and disc
    this.show = function () {
            fill(200);
            // Show PlinkoBoard background
            rect(this.position.x, this.position.y, this.size_width, this.size_height);
        // Show the disc(s)
            for (var i = 0; i < this.discs.length; i++) {
                this.discs[i].show();
            }
        // Show Pegs
            for (var j = 0; j < this.pegs.length; j++) {
                this.pegs[j].show();
            }
        // Show the labels of the containers at the end, the names
            for (var name_index = 0; name_index < this.names.length; name_index++) {
                var temp_x = this.position.x + ((name_index) * (this.names_width)) + (this.names_width / 2); // add half a width for centering  
                var temp_y = this.position.y + this.size_height - (this.size_height / this.row_count);
                var text1 = this.names[name_index];
                // if option hideNames option is set replace the name labels with ???'s so you cant aim
                if (hideNames && !isDiscDropping) {
                    text1 = "????";
                }
                text(text1, temp_x - (text1.length * (15 / 4)), temp_y); // center text with char length
            }
        }
        // Shuffles the array of remaining names for selection (Algorithm src: https://bost.ocks.org/mike/shuffle/)
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
    this.setWinner = function(disc){
        foundWinner = true;
        // get index from mapping disc x to array keys
        winner = Math.floor(map(disc.position.x-this.position.x,0,this.size_width,0,this.names.length));
        removeNameBtn.show();
    }
    // initialize board with firebase data
    this.setNames = function (names) {
        this.discs[0] = (new Disc(this, createVector(this.position.x, this.position.y + 20), 20));
        this.names = names;
        this.names_width = this.size_width / names.length;
        this.shuffleNames();
        for (var name_index = 0; name_index < names.length - 1; name_index++) {
            this.pegs.push(new Peg(createVector(this.position.x + ((name_index + 1) * (this.names_width)), this.position.y + this.size_height - (this.size_height / this.row_count)), 6));
            this.pegs.push(new Peg(createVector(this.position.x + ((name_index + 1) * (this.names_width)), this.position.y + this.size_height - (this.size_height / this.row_count) / 2), 6));
            this.pegs.push(new Peg(createVector(this.position.x + ((name_index + 1) * (this.names_width)), this.position.y + this.size_height), 6));
        }
    }
}