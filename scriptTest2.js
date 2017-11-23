// The user needs to enter their name and phone number to be captured by our app for sending to emergency services.
//--The name and phone number will be open variables to vary from user to user
// 
/* global firebase */
/* global Firebase */
/* global google */
/* global position */
//Document ready function
$(function() {
    // Upon page load, We show our About modal to give the user directions and to grab their location data.
    $("#aboutWindow").modal("show");
    $("#registered").on("click", function() {
        $("#aboutWindow").modal("hide");
    });

    $("#hideSignOut").hide();

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
    var watchID = "";

    //Get Location upon page load
    function getLocation() {
        if (navigator.geolocation) {
            var optn = {
                enableHighAccuracy: true,
                timeout: Infinity,
                maximumAge: 5000
            };
            watchID = navigator.geolocation.watchPosition(copyPosition);
        }
        else {
            alert("Geolocation is not supported by this browser.");
        }

    }

    getLocation();

    function copyPosition(position) {
        var gLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOtn = {
            zoom: 15,
            center: gLatLng,
            mapTypeId: google.maps.MapTypeId.ROAD
        };

        var Pmap = document.getElementById("map");

        var map = new google.maps.Map(Pmap, mapOtn);

        addMarker(map, gLatLng, "Your Location: " + gLatLng, "You Are Here!");

        // Add man Marker to Map
        function addMarker(map, gLatLng, title, content) {
            var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
            var markerOptn = {
                position: gLatLng,
                map: map,
                title: title,
                icon: iconBase + 'man.png'
            };

            var marker = new google.maps.Marker(markerOptn);

            var infoWindow = new google.maps.InfoWindow({ content: content, position: gLatLng });

            google.maps.event.addListener(marker, "click", function() {
                infoWindow.open(map);
            });
        }
        //End Man Marker

        lat = position.coords.latitude;
        lng = position.coords.longitude;

    }
    // End Get Location

    //Get realtime weather from simple weather library
    navigator.geolocation.getCurrentPosition(function(position) {
        loadWeather(position.coords.latitude + ',' + position.coords.longitude); //load weather using your lat/lng coordinates
    });

    function loadWeather(location, woeid) {
        $.simpleWeather({
            location: location,
            woeid: woeid,
            unit: 'f',
            success: function(weather) {
                html = '<h2><i class="icon-' + weather.code + '"></i> ' + weather.temp + '&deg;' + weather.units.temp + '</h2>';
                // html += '<ul><li>' + weather.city + ', ' + weather.region + '</li>';
                // html += '<li class="currently">' + weather.currently + '</li>';
                // html += '<li>' + weather.alt.temp + '&deg;C</li></ul>';

                $("#weather").html(html);
            },
            error: function(error) {
                $("#weather").html('<p>' + error + '</p>');
            }
        });
    }
    // End Realtime Weather data

    //Begin Shaun Login

    // Handles the sign up button press.
    $("#register").on("click", function handleSignUp() {
        var firstName = $("#firstName").val().trim();
        var lastName = $("#lastName").val().trim();
        var phoneNumber = $("#phoneNumber").val().trim();
        var email = $("#email").val().trim();
        var password = $("#password").val().trim();

        if ($("#fullName").val() === "",
            $("#phoneNumber").val() === "",
            $("#email").val() === "",
            $("#password").val() === "") {
            alert("Please fill out entire form to continue.");
            return false;
        }
        // Sign in with email and pass.
        // [START createwithemail]
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(newUsers => {
                firstName: firstName;
                lastName: lastName;
                phoneNumber: phoneNumber;
                email: email;
                password: password;
                var users = {
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    email: email,
                    password: password,
                    timeAdded: firebase.database.ServerValue.TIMESTAMP
                };

                firebase.database().ref('users/' + newUsers.uid).set(users);

                console.log("Welcome User: " + users);
            });
        var form = document.getElementById("registerForm");
        form.reset();
        $("#oginWindow").modal("show");
    });

    var firstName;
    var lastName;
    var phoneNumber;

    //Handles the sign in button press.
    $("#login").on("click", function toggleSignIn() {
        var email = $("#email1").val().trim();
        console.log(email);

        var password = $("#password1").val().trim();
        console.log(password);

        if ($("#email1").val() === "",
            $("#password1").val() === "") {
            alert("Please fill out email and password to continue.");
            return false;
        }

        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(loggedIn => {
                loggedInEmail: email;
                loggedInPassword: password;
                var loggingIn = [firstName, lastName, phoneNumber, email, password];

                firebase.database().ref('loggedInUsers/' + loggedIn.uid).set(loggingIn);

                console.log("This person is logged in: " + loggingIn);
            });

        var form = document.getElementById("loginForm");
        form.reset();
        $("#hideSignOut").show();
        $("#hideSignIn").hide();
    });

    $("#signOut").on("click", function() {
        firebase.auth().signOut().then(function() {
            console.log('Signed Out');
        }, function(error) {
            console.error('Sign Out Error', error);
        });
        $("#hideSignOut").hide();
        $("#hideSignIn").show();
    });

    //End Shaun Login



    //SendPolice function starts now
    var s;
    var fFirstName;
    var fLastName;
    var fPhone;
    var fLat;
    var fLng;

    // database.ref().once("value", function(snapshot) {
    //     s = snapshot.val();
    //     console.log(s);
    //     fFirstName = s.firstname;
    //     fLastName = s.lastname;
    //     fPhone = s.phonenumber;
    //     fLat = s.lat;
    //     fLng = s.lng;


    //     console.log("First Name: " + fFirstName);
    //     console.log("Last Name " + fLastName);
    //     console.log("Phone: " + fPhone);
    //     console.log("Latitude: " + fLat);
    //     console.log("Longitude: " + fLng);
    // });

    $("#contactEMS").on("click", function() {

        var URL = "https://sandbox.sendpolice.com/v1/alerts?user_key=349dff0af7377e573e305ce9a890cb22";
        var body = {
            firstName: fFirstName,
            lastName: fLastName,
            phone: fPhone,
            pin: "1234",
            location: {
                lat: lat,
                lon: lng,
                accuracy: 5
            }
        };

        console.log("test");
        $.ajax({
            type: "POST",
            url: URL,
            data: body,
            success: function(response) {
                console.log(response);
            },
            error: function() {
                console.log("error");
            }
        });

    });
    //End SendPolice




}); // document ready function end
