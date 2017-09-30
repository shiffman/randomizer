let input;
let submit;
let result;

function setup() {
    noCanvas();

    let config = {
        apiKey: "AIzaSyA-VyZJOZVqXZj82wvVMkfJedDEhqXcIh8",
        authDomain: "a2zitp-6519b.firebaseapp.com",
        databaseURL: "https://a2zitp-6519b.firebaseio.com",
        storageBucket: "a2zitp-6519b.appspot.com",
        messagingSenderId: "363965061200"
    };

    firebase.initializeApp(config);
    database = firebase.database();

    input = select('#names');
    submit = select('#submit');
    result = select('#result');

    checkInput();

    submit.mousePressed(() => {
        let data = input.value();
        names = data.split('\n');

        // If blank
        for (let i = names.length - 1; i >= 0; i--) {
            names[i] = names[i].trim();
            if (names[i].length === 0) {
                names.splice(i, 1);
            }
        }

        sendToFirebase(names, result);
    });

    input.input(() => {
      checkInput(input, submit);
    });
}

function checkInput() {
  // Check if the input is invalid and disable the button
  if (input.value().trim().length <= 0) {
    submit.attribute('disabled', true);
    result.html('');
  } else {
    submit.removeAttribute('disabled');
  }
}
