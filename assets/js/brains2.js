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

    var lat = "";
    var lng = "";

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(copyPosition);
        }
        else {
            alert("Geolocation is not supported by this browser.");
        }

    }

    getLocation();

    function copyPosition(position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
    }


    $("#InfoInput").on("click", function(event) {
        event.preventDefault();

        var name = $("#nameInput").val().trim();
        console.log("Name: " + name);
        var phone = $("#phoneInput").val().trim();
        console.log("Phone: " + phone);

        database.ref().push({
            name: name,
            phone: phone,
            lat: lat,
            lng: lng,
            timeAdded: firebase.database.ServerValue.TIMESTAMP

        });

        // var form = document.getElementById("contactForm");
        // form.reset();
        // // alert("Thank you!"); SHOULD BE A MODAL SAYING THANK YOU OR SOMETHING?
        //return false;

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
