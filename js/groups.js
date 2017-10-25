function setup() {
  loadFirebase(loaded);

  var params = getURLParams();
  var seed = Number(params.seed.substring(0,1))

  function loaded() {
    if (!names) {
      names = ['oops','i','didn\'t', 'load','any','names'];
    }

    for (var i = 0; i < names.length; i++) {
      //var n = createDiv(names[i]);
      //n.parent('names');
    }
    howmany = 0;
    randomSeed(seed);
    console.log(seed);
    shuffler();
    setTimeout(shuffler,timing);
  }

  //names = ['dan','aliki','elias','olympia','one','two'];


  //var shuffleButton = select('#shuffle');

  var timing = 10;
  var howmany = 0;

  //shuffleButton.mousePressed(function() {

  //});

  function shuffler() {
    var num = 2;//select('#num').value();
    var total = floor(names.length / num);

    namescopy = names.slice();//copy(names);

    var groups = [];
    for (var i = 0; i < total; i++) {
      var group = [];
      for (var j = 0; j < num; j++) {
        var index = floor(random(namescopy.length));
        group.push(namescopy[index]);
        namescopy.splice(index,1);
      }
      groups.push(group);
    }

    if (namescopy.length > 0) {
      // Hack for one leftover with special case of groups of 7
      if (namescopy.length === 1) {
        groups[0].push(namescopy[0]);
      } else {
        groups.push(namescopy);
      }
    }
    //console.log(groups);
    buildTable(groups);

    howmany++;
    if (howmany < 100) {
      setTimeout(shuffler, timing);
    }
    var countdown = floor((100-howmany)/10);
    select('#timer').html(countdown+1);

  }

}


function buildTable(groups) {

  var allcells = selectAll('.tablecell');
  for (var i = 0; i < allcells.length; i++) {
    allcells[i].remove();
  }


  var rooms = ['lounge', '50', '20', '15', 'AB', 'conference'];
  var space = [10, 10, 7, 7, 7, 7];

  var room = 0;
  var count = 0;

  //var num = select('#num').value();
  //console.log(groups.length);

  for (var i = 0; i < groups.length; i++) {

    // var th = createElement('th');
    // th.html(i);
    // th.class('tablecell')
    // th.parent(rooms[i]);

    var tr = createElement('tr');
    tr.id('row'+i);
    tr.class('tablecell');
    var where = rooms[room]+'body';
    //console.log(where);
    tr.parent(where);

    for (var j = 0; j < groups[i].length; j++) {
      var td = createElement('td');
      td.html(groups[i][j]);
      td.class('tablecell');
      td.style('width', '300px')
      td.parent('row'+i);
    }
    count++;
    if (count > space[room]) {
      room++;
      count = 0;
    }

  }
}
