// The user needs to enter their name and phone number to be captured by our app for sending to emergency services.
//--The name and phone number will be open variables to vary from user to user
// 
/* global firebase */
/* global google */
//Document ready function
$(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBYkMTioukhTliOIKHJauTsX6WVM2aUIfg",
        authDomain: "adventurebuddy-fc144.firebaseapp.com",
        databaseURL: "https://adventurebuddy-fc144.firebaseio.com",
        projectId: "adventurebuddy-fc144",
        storageBucket: "adventurebuddy-fc144.appspot.com",
        messagingSenderId: "599196361369"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    $("#infoInput").on("click", function(event) {
        event.preventDefault();

        var name = $("#fullName").val().trim();
        console.log("Name: " + name);
        var phone = $("#phoneNumber").val().trim();
        console.log("Phone: " + phone);

        database.ref().push({
            name: name,
            phone: phone,
            timeAdded: firebase.database.ServerValue.TIMESTAMP

        });

        var form = document.getElementById("contactForm");
        form.reset();
        // alert("Train Successfully Added!"); SHOULD BE A MODAL SAYING THANK YOU OR SOMETHING?
        return false;

    });


    // var unirest = require('unirest');

    // var body = {
    //     name: "John Smith",
    //     phone: "5555555555",
    //     pin: "1234",
    //     location: {
    //         lat: 34.32334,
    //         lon: -117.3343,
    //         accuracy: 5
    //     }
    // };

    // unirest.post('https://sandbox.sendpolice.com/v1/alerts?user_key=349dff0af7377e573e305ce9a890cb22')
    //     .type('json')
    //     .send(body)
    //     .end(function(response) {
    //         console.log(response);
    //     });






});
