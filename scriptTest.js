// The user needs to enter their name and phone number to be captured by our app for sending to emergency services.
//--The name and phone number will be open variables to vary from user to user
// 
/* global firebase */
/* global google */
/* global position */
//Document ready function
$(function() {
    // Upon page load, We show our About modal to give the user directions and to grab their location data.
    $("#aboutWindow").modal("show");
    $("#registered").on("click", function() {
        $("#aboutWindow").modal("hide");
    });

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
    // // End Realtime Weather data

    //Begin Eric Login

    var state = {
        email: '',
        password: '',
    }
    $("#register").on('click', event => {
        event.preventDefault();
        var firstName = $('#firstName').val() || state.firstName;
        var lastName = $('#lastName').val() || state.lastName;
        var phoneNumber = $('#phoneNumber').val() || state.phoneNumber;
        var email = $('#email').val() || state.email;
        var password = $('#password').val() || state.password;
        var lattitude = state.lat;
        var longitude = state.lng;
        console.log(email, password);
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(user => {
                state.email = email;
                state.password = password;
                state.firstName = firstName;
                state.lastName = lastName;
                state.phoneNumber = phoneNumber;
                var users = {
                    firstname: firstName,
                    lastname: lastName,
                    phonenumber: phoneNumber,
                    email: email,
                    password: password,
                    location: markerOptn,
                };
                $('#email').addClass('hidden');
                $('#password').addClass('hidden');
                firebase.database().ref('email').push({
                    email,
                });
                $('#register').trigger('reset');



                firebase.database().ref('users').push(users);





            })
            .catch(error => {
                console.log(error);

            })
        $("#loginWindow").modal("show");
    });
    var state = {
        email: '',
        password: '',
    }
    $("#login").on('click', event => {
        event.preventDefault();
        var email = $('#email1').val() || state.email;
        var password = $('#password1').val() || state.password;
        console.log(email, password);
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(user => {
                state.email = email;
                state.password = password;
                $('#email1').addClass('hidden');
                $('#password1').addClass('hidden');
                firebase.database().ref('email').push({
                    email,
                });
                $('#login').trigger('reset');
                // window.location = "https://preview.c9users.io/shaunbens/adventurebuddy/Project_1/Playground/indexTest.html?_c9_id=livepreview5&_c9_host=https://ide.c9.io"


            })
            .catch(error => {
                console.log(error);
            })


    })

    //End Eric Login


    var s;
    var fName;
    var fPhone;
    var fLat;
    var fLng;

    database.ref().on("child_added", function(snapshot) {
        s = snapshot.val();
        fName = s.name;
        fPhone = s.phone;
        fLat = s.lat;
        fLng = s.lng;


        console.log("Name: " + fName);
        console.log("Phone: " + fPhone);
        console.log("Latitude: " + fLat);
        console.log("Longitude: " + fLng);
    });

    $("#contactEMS").on("click", function() {

        var URL = "https://sandbox.sendpolice.com/v1/alerts?user_key=349dff0af7377e573e305ce9a890cb22";
        var body = {
            name: fName,
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





}); // document ready function end
