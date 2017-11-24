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


    // $("#aboutWindow").modal("show");

    initApp();
}); // document ready function end



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

$("#aboutBtn").click(function() {
    $("#aboutWindow").modal("show");
});

//Begin Shaun Login
var firstName;
var lastName;
var phoneNumber;
var email;
var loggedInUser = {
    firstName,
    lastName,
    phoneNumber
};
var user;
var userId;
var uid;

/**
 * Handles the sign up button press.
 */
$("#register").click(function handleSignUp() {
    firstName = $("#firstName").val().trim();
    // console.log(firstName);

    lastName = $("#lastName").val().trim();
    // console.log(lastName);

    phoneNumber = $("#phoneNumber").val().trim();
    // console.log(phoneNumber);

    var email = $("#email").val().trim();
    // console.log(email);

    var password = $("#password").val().trim();
    // console.log(password);

    if (email.length < 2) {
        alert('Please enter an email address.');
        return false;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return false;
    }
    if (phoneNumber.length != 10) {
        alert("Please enter 10 digit number with no spaces.");
        return false;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            }
            else {
                alert(errorMessage);
            }
            console.log(error);
            // [END_EXCLUDE]
        })
        .then(newUsers => {
            var allUsers = {
                firstName,
                lastName,
                phoneNumber,
                email,
                password,
                UID: uid,
                timeAdded: firebase.database.ServerValue.TIMESTAMP
            };

            firebase.database().ref('users/' + newUsers.uid).set(allUsers);

            console.log("Welcome User: " + allUsers.firstName);
        });
    $("#aboutWindow").hide();
    $("#loginWindow").show();


    // [END createwithemail]
});


// var userId = firebase.auth().currentUser.uid;
// return firebase.database().ref("users/" + userId).once("value").then(function(snapshot) {
//     loggedInUser = (snapshot.val() && snapshot.val().loggedInUser);
//     console.log("New Registered User: " + loggedInUser);
// });

/**
 * Handles the sign in button press.
 */
$("#login").click(function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    }
    else {
        // var firstName = $("#firstName").val().trim();
        // var lastName = $("#lastName").val().trim();
        // var phoneNumner = $("#phoneNumber").val().trim();
        var email = $("#email1").val().trim();
        var password = $("#password1").val().trim();
        if (email.length < 2) {
            alert('Please enter an email address.');
            return false;
        }
        if (password.length < 2) {
            alert('Please enter a password.');
            return false;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            }
            else {
                alert(errorMessage);
            }
            console.log(error);
            // [END_EXCLUDE]

        });
        // [END authwithemail]

    }
    $("#hideSignIn").hide();
    $("#hideSignOut").show();

});


// Sign out button functionality
$("#signOut").on("click", function() {
    firebase.auth().signOut().then(function() {
        console.log('Signed Out');
    }, function(error) {
        console.error('Sign Out Error', error);
    });

    $("#hideSignOut").hide();
    $("#hideSignIn").show();
});


/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {
            // User is signed in.
            firstName = user.firstName;
            lastName = user.lastName;
            phoneNumber = user.phoneNumber;
            email = user.email;
            userId = user.uid;
            console.log(user.uid);
            $("#hideAbout").hide();
            $("#hideSignIn").hide();
            $("#aboutWindow").hide();
        }
        else {
            // User is signed out.
            console.log("No User present.");
            $("#hideAbout").show();
            $("#aboutWindow").modal("show");
            $("#hideSignOut").hide();
        }
    });
}



//End Shaun Login



//SendPolice function starts now
$("#contactEMS").click(function() {
    userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('users/' + userId).once('value').then(function(snapshot) {
        var userInfo = (snapshot.val() && snapshot.val().userId.firstName.lastName.phoneNumber);
        console.log(userInfo);
    });

});

$("#EMSnow").on("click", function() {

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
