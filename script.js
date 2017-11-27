// The user needs to enter their name and phone number to be captured by our app for sending to emergency services.
//--The name and phone number will be open variables to vary from user to user
// 
/* global firebase */
/* global Firebase */
/* global google */
/* global position */
//Document ready function
$(function() {
    // Upon page load, We check if a user is logged in and grab our location.

    initApp();
    getLocation();
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
// var watchID = "";


//Get Location upon page load
function getLocation() {
    if (navigator.geolocation) {
        var optn = {
            enableHighAccuracy: true,
            timeout: Infinity,
            maximumAge: 5000
        };
        console.log("Map Refresh");

        navigator.geolocation.watchPosition(copyPosition);
    }
    else {
        alert("Geolocation is not supported by this browser.");
    }
}

// getLocation();

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

    // var latNew = "";

    // var lngNew = "";

    // latNew = position.coords.latitude;
    // lngNew = position.coords.longitude;

    // console.log(latNew, "latNew");
    // console.log(lngNew, "lngNew");
    // console.log(lat, "lat");
    // console.log(lng, "lng");

    // // user is moving so nothing is wrong
    // // if (latNew > (Math.abs(lat) + .00001) || latNew < (Math.abs(lat) - .00001) || lngNew > (Math.abs(lng) + .00001) || lngNew < (Math.abs(lng) - .00001)) {

    // if (latNew !== lat || lngNew !== lng) {
    //     console.log("latNew or longNew");
    // }

    // //user is stopped, start timer
    // else {
    //     console.log("else");
    //     setTimeout(function() {
    //         $("#youOK").modal('show');
    //     }, 5000);

    // }

    lat = position.coords.latitude;
    lng = position.coords.longitude;

}

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
var fullName;
var phoneNumber;
var email;
var user;
var userId;
var uid;

/**
 * Handles the sign up button press.
 */
$("#register").click(function handleSignUp() {
    fullName = $("#fullName").val().trim();
    // console.log(fullName);

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
                fullName,
                phoneNumber,
                email,
                password,
                // UID: uid,
                timeAdded: firebase.database.ServerValue.TIMESTAMP
            };

            firebase.database().ref('users/' + newUsers.uid).set(allUsers);

            console.log("Welcome User: " + allUsers.fullName);
        });
    var form = document.getElementById("registerForm");
    form.reset();

    $("#aboutWindow").hide();
    // $("#loginWindow").show();
    $("#hideSignOut").show();


    // [END createwithemail]
});

$("#registered").click(function() {
    $("#aboutWindow").modal("hide");
})

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
        email = $("#email1").val().trim();
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
            var form = document.getElementById("inputForm");
            form.reset();
        });
        // [END authwithemail]

    }

    $("#hideSignIn").hide();
    $("#hideSignOut").show();
    console.log("Lattitude: " + lat, "Longitude: " + lng);

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
            fullName = user.fullName;
            phoneNumber = user.phoneNumber;
            email = user.email;
            userId = user.uid;
            // getLocation();
            console.log("Current Logged in User ID: " + userId);
            // console.log("Lattitude: " + lat, "Longitude: " + lng);
            $("#hideAbout").hide();
            $("#hideSignIn").hide();
            // $("#aboutWindow").hide();
            $("#contactEMS").show();
            $("#loginWindow").modal("hide");
        }
        else {
            // User is signed out.
            console.log("No User present.");
            $("#hideAbout").show();
            $("#aboutWindow").modal("show");
            $("#hideSignOut").hide();
            $("#contactEMS").hide();
            // navigator.geolocation.clearWatch();
        }
    });
}
//End Shaun Login

// Timer to send police on no movement

// $("#youOK").on('click', function() {
//     // $('#youOK').modal('show');
//     console.log('shown');
//     startTimer();
//     decrement();
//     contactEMS();
// });

// var count = 11;
// var intervalId;

// function startTimer() {
//     intervalId = setInterval(decrement, 1000);
// }



// function decrement() {
//     --count;
//     // minutes = (minutes < 10) ? minutes : minutes;
//     $('#showTimer').text("Time Remaining: " + count + " Seconds");
//     console.log(count);

//     if (count === 0) {
//         EMSnow();
//         stop();
//         $("#youOK").hide();
//         reset();
//         $("#confirmEMS").show();
//     }
//     else {
//         $("#imOK").click(function() {
//             stop();
//             // mapRefresh();
//             reset();
//             $("#youOK").hide();
//         });
//     }
// }

// function stop() {
//     clearInterval(intervalId);
// }

// function reset() {
//     count = 10;
//     $("#showTimer").html("Time Remaining: " + count + " Seconds");
// }

// function contactEMS() {
//     userId = firebase.auth().currentUser.uid;

//     return firebase.database().ref('users/' + userId).once('value').then(function(snapshot) {
//         var s = snapshot.val();
//         fFullName = s.fullName;
//         fPhone = s.phoneNumber;
//         var userInfo = ({
//             fFullName,
//             fPhone

//         });
//         console.log(userId);
//         console.log(userInfo);
//     });

// }

// function EMSnow() {

//     var URL = "https://sandbox.sendpolice.com/v1/alerts?user_key=349dff0af7377e573e305ce9a890cb22";
//     var body = {
//         name: fFullName,
//         phone: fPhone,
//         pin: "1234",
//         location: {
//             lat: lat,
//             lon: lng,
//             accuracy: 5
//         }
//     };

//     console.log("SendPolice Testing");
//     $.ajax({
//         type: "POST",
//         url: URL,
//         data: body,
//         success: function(response) {
//             console.log(response);
//             console.log("SendPolice Successful");
//         },
//         error: function() {
//             console.log("error");
//         }
//     });

// }


//SendPolice function starts now

var fFullName;
var fPhone;
var userInfo;



$("#contactEMS").click(
    function contactEMS() {
        userId = firebase.auth().currentUser.uid;

        return firebase.database().ref('users/' + userId).once('value').then(function(snapshot) {
            var s = snapshot.val();
            fFullName = s.fullName;
            fPhone = s.phoneNumber;
            var userInfo = ({
                fFullName,
                fPhone

            });
            console.log(userId);
            console.log(userInfo);
        });

    });

$("#cancelEMS").click(function() {
    console.log("EMS request cancelled.");
});

$("#EMSnow").on("click",
    function EMSnow() {

        var URL = "https://sandbox.sendpolice.com/v1/alerts?user_key=349dff0af7377e573e305ce9a890cb22";
        var body = {
            name: fFullName,
            phone: fPhone,
            pin: "1234",
            location: {
                lat: lat,
                lon: lng,
                accuracy: 5
            }
        };

        console.log("SendPolice Testing");
        $.ajax({
            type: "POST",
            url: URL,
            data: body,
            success: function(response) {
                console.log(response);
                console.log("SendPolice Successful");
            },
            error: function() {
                console.log("error");
            }
        });

    });
//End SendPolice
