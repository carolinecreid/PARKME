var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var userLat;
var userLng;
var userPos;
var carLat;
var carLng;
var carPos;
//var carLat = 39.679309;
//var carLng = -104.9597899;
//var phoPos = new google.maps.LatLng(phoLat,phoLng);

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(userPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
    document.getElementById("directions-panel").style.display = 'block';
    document.getElementById("map-canvas").style.display = 'block';
    document.getElementById("scrolling").style.display = 'block';
}

function getCarLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(carLoc);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function userPosition(position) {
    userLat = position.coords.latitude;
    userLng = position.coords.longitude;
    userPos = new google.maps.LatLng(userLat, userLng);
    initialize();
}

function carLoc(position) {
    carLat = position.coords.latitude;
    carLng = position.coords.longitude;
    carPos = new google.maps.LatLng(carLat, carLng);
    localStorage.setItem("carLoc", carPos);
    //show user buttons for timer and directions
    document.getElementById("timerValue").style.display = 'block';
    document.getElementById("timerButton").style.display = 'block';
    document.getElementById("directionButton").style.display = 'block';
    document.getElementById("carLocationButton").style.display = 'none';
    document.getElementById("cellphone").style.display = 'block';
    document.getElementById("goaway").style.display = 'none';
}

function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(userLat, userLng)
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));
    calcRoute();
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
}

function calcRoute() {
    var request = {
        origin: userPos,
        destination: carPos,
        travelMode: google.maps.TravelMode.WALKING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

//http://www.w3schools.com/js/js_dates.asp
//http://www.w3schools.com/jsref/jsref_gettime.asp
function countdownTimer(time) {
    //gets current milliseconds of time
    var b = new Date();
    var curTimeMilliSec = b.getTime();
    console.log(time);
    if (time === null) {
        time = document.getElementById("timerValue").value;
        var parkingTime = time;
        parkingTime *= 60000;
    }
    else {
        var parkingTime = time;
    }



    var finalTimeMilli = curTimeMilliSec + parkingTime;
    localStorage.setItem("parkTime", finalTimeMilli);
    //alert(curTimeMilliSec + "and" + finalTime);

    function clear(ctx) {
        ctx.clearRect(0, 0, 80, 80);
    }

    function setTrack(ctx) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(36, 36, 27, 0, Math.PI * 2);
        ctx.stroke();
    }

    //changing circle settings
    function setTime(ctx, until, now, total) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(
                36,
                36,
                27,
                Math.PI / -2,
                (Math.PI * 2) * ((until - now % total) / total) + (Math.PI / -2),
                false
                );
        ctx.stroke();
    }

    var mo = document.getElementById('months').getContext('2d'),
            d = document.getElementById('days').getContext('2d'),
            h = document.getElementById('hours').getContext('2d'),
            mi = document.getElementById('minutes').getContext('2d'),
            s = document.getElementById('seconds').getContext('2d'),
            ms = document.getElementById('milliseconds').getContext('2d');
    function set() {
        var parkingDate = new Date(finalTimeMilli);
        var today = new Date();
        clear(h);
        setTrack(h);
        setTime(h, parkingDate.getHours(), today.getHours(), 24);
        clear(mi);
        setTrack(mi);
        setTime(mi, parkingDate.getMinutes(), today.getMinutes(), 60);
        clear(s);
        setTrack(s);
        setTime(s, parkingDate.getSeconds(), today.getSeconds(), 60);
        if (parkingDate <= new Date())
        {
            alert("Move your car!");
            document.getElementById('timer').innerHTML = "Time up, move your car";
        }
        else {
            requestAnimationFrame(set);
        }
    }


    requestAnimationFrame(set);
}

function timer() {

    //parkTime is milli seconds at which the timer will end
    var storedTime = localStorage.getItem("parkTime");
    console.log(storedTime);
    var b = new Date();
    var currentMS = b.getTime();
    console.log(currentMS);
    console.log(localStorage.getItem("carLoc"));
    if (storedTime !== null) {//already a parking time started
        //alert("entered if statement 1");

        if (storedTime <= currentMS) {
            localStorage.clear();
            //alert("entered within if statement");
        }
        else {
            //make parkingDate localstroage-current milliseconds
            //alert("using else statement");
            var finalMS = storedTime - currentMS;
            console.log(finalMS);
            //display timer
            countdownTimer(finalMS);
            //get car location
            getCarLocation();
        }

    }
    else {
        //load regular page
        //alert("attempted to load reg page");
    }
}





//window.onload = getLocation;
//google.maps.event.addDomListener(window, 'load', initialize);
