function sendToParse(names, elt) {
  var NameList = Parse.Object.extend("NameList");
  var config = new NameList();

  var data = {};
  data.names = names;

  var id;
  config.save(data).then(function(result) {
    id = result.id;
    console.log(data);
    var url1 = 'http://shiffman.net/randomizer/groups.html?id='+id;
    var url2 = 'http://shiffman.net/randomizer/spin.html?id='+id;
    //var url = 'http://localhost:8001/spin.html?id='+id;
    elt.html('<a href="' + url1 +'">' + url1 +'</a><br />' + '<a href="' + url2 +'">' + url2 +'</a><br />');
  });
}


var names;



function loadParse(todo) {
  var params = getURLParams();
  var NameList = Parse.Object.extend("NameList");
  var query = new Parse.Query(NameList);
  
  var id = params.id;

  if (!id) {
    todo();
  } else {
    // clean up params.id problem
    if (id.charAt(id.length-1) === '/') {
      id = id.substring(0, id.length - 1);
    }
    query.get(id, {
      success: function(config) {
        names = config._serverData.names;
        console.log(names);
        todo();
      },
      error: function(object, error) {
        console.log('ooops', error);
        todo();

      }
    });
  }
}