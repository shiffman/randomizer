function sendToFirebase(names, elt) {
  var namesDB = database.ref('names');

  var data = {};
  data.names = names;

  var namesData = namesDB.push(data, finished);
  console.log("Firebase generated key: " + namesData.key);
  var id = namesData.key;

  function finished(err) {
    if (err) {
      console.log("ooops, something went wrong.");
      console.log(err);
    } else {
      var url1 = 'groups/?id=' + id;
      var url2 = 'spin/?id=' + id;
      var url3 = 'survivor/?id=' + id;
      var url4 = 'plinko/?id=' + id;
      //var url = 'http://localhost:8001/spin.html?id='+id;
      elt.html('<a href="' + url2 + '">spin</a><br />' + '<a href="' + url1 + '">groups</a><br />' + '<a href="' + url3 + '">survivor</a><br />' + '<a href="' + url4 + '">plinko</a><br />');
    }
  }
}


var names;

function loadFirebase(todo) {
  var params = getURLParams();


  var id = params.id;

  if (!id) {
    todo();
  } else {
    // clean up params.id problem
    if (id.charAt(id.length - 1) === '/') {
      id = id.substring(0, id.length - 1);
    }
    var ref = database.ref("names/" + id);
    ref.on("value", gotNames, errData);

    function errData(error) {
      console.log("Something went wrong.");
      console.log(error);
      todo();
    }

    // The data comes back as an array
    function gotNames(data) {
      names = data.val().names;
      console.log(names);
      todo();
    }
  }
}
