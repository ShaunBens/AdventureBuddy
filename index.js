$(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAs8k309KbvyovQxaCnbSLV0_sOq-wRJrQ",
        authDomain: "adventurebuddy-b382b.firebaseapp.com",
        databaseURL: "https://adventurebuddy-b382b.firebaseio.com",
        projectId: "adventurebuddy-b382b",
        storageBucket: "adventurebuddy-b382b.appspot.com",
        messagingSenderId: "28112253143"
    };
    firebase.initializeApp(config);
    var state = {
        email: '',
        password: '',
    }
    $("#create").on('click', event => {
        event.preventDefault();
        var email = $('#email').val() || state.email;
        var password = $('#password').val() || state.password;
        console.log(email, password);
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(user => {
                state.email = email;
                state.password = password;
                $('#email').addClass('hidden');
                $('#password').addClass('hidden');
                firebase.database().ref('email').push({
                    email,
                });
                $('#create').trigger('reset');


            })
            .catch(error => {
                console.log(error);
            })
        window.location = "https://preview.c9users.io/weslaughter0717/eric_slaughter/AdventureBuddy/yodawg.html"
    });
});
