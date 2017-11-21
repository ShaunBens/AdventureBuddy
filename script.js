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

    var name = "";
    var phone = "";
    var email = "";
    var password = "";


    $("#register").on("click", function() {

        if ($("#fullName").val() === "",
            $("#phoneNumber").val() === "",
            $("#email").val() === "",
            $("#password").val() === "") {
            alert("Please fill out entire form to continue.");
            return false;
        }


        name = $("#fullName").val().trim();
        console.log("Name: " + name);

        phone = $("#phoneNumber").val().trim();
        console.log("Phone: " + phone);

        email = $("#email").val().trim();
        console.log("Email: " + email);

        password = $("#password").val().trim();
        console.log("Password: " + password);

        database.ref().push({
            name: name,
            phone: phone,
            email: email,
            password: password,
            lat: lat,
            lng: lng,
            timeAdded: firebase.database.ServerValue.TIMESTAMP

        });
        console.log("complete");

        var form = document.getElementById("inputForm");
        form.reset();
        $("#loginWindow").modal("show");
        // return false;

    });


    $("#formSubmit").on("click", function(event) {
        event.preventDefault();

        if ($("#emailSignIn").val() === "",
            $("#passwordSignIn").val() === "") {
            alert("Please enter Name and Phone to Continue.");
            return false;
        }

        email = $("#email").val().trim();
        console.log("Email: " + email);
        password = $("#password").val().trim();
        console.log$("Password: " + password);


        var form = document.getElementById("inputForm");
        form.reset();
        $("#loginWindow").modal("hide");
        return false;

    });
    // Begin process to pull data from firebase to use in case of SendPolice is activated
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
