function setup() {
    noCanvas();
    var config = {
        apiKey: "AIzaSyA-VyZJOZVqXZj82wvVMkfJedDEhqXcIh8",
        authDomain: "a2zitp-6519b.firebaseapp.com",
        databaseURL: "https://a2zitp-6519b.firebaseio.com",
        storageBucket: "a2zitp-6519b.appspot.com",
        messagingSenderId: "363965061200"
    };
    firebase.initializeApp(config);
    database = firebase.database();

    var input = select('#names');
    var submit = select('#submit');
    var result = select('#result');

    submit.mousePressed(function () {
        var data = input.value();
        names = data.split('\n');
        // If blank
        for (var i = names.length - 1; i >= 0; i--) {
            names[i] = names[i].trim();
            if (names[i].length === 0) {
                names.splice(i, 1);
            }
        }

        sendToFirebase(names, result);
    });
}