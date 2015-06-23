function sendToParse(names, elt) {
  var NameList = Parse.Object.extend("NameList");
  var config = new NameList();

  var data = {};
  data.names = names;

  var id;
  config.save(data).then(function(result) {
    id = result.id;
    console.log(data);
    //var url = 'http://shiffman.net/randomizer/?id='+id;
    var url = 'http://localhost:8001/?id='+id;
    elt.html('<a href="' + url +'">' + url +'</a>');
  });
}


var names;

function loadParse() {
  var params = getURLParams();
  var NameList = Parse.Object.extend("NameList");
  var query = new Parse.Query(NameList);
  
  var id = params.id;


  if (!id) {
    createNames();
  } else {
    // clean up params.id problem
    if (id.charAt(id.length-1) === '/') {
      id = id.substring(0, id.length - 1);
    }

    query.get(id, {
      success: function(config) {
        names = config._serverData.names;
        createNames();
        console.log(names);
      },
      error: function(object, error) {
        console.log('ooops', error);
        createNames();

      }
    });
  }
}