var lat;
var lon; 
var latdes;
var londes;
var flag = 0;

function initMap() {
  if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(todoBien, hayError);
    }

}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  var selectedMode = "DRIVING";
  var p1 = new google.maps.LatLng(lat, lon);
  var p2 = new google.maps.LatLng(latdes, londes);
  var km = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
  
  $('.price').html("$"+ (km*2) );

  localStorage.setItem("Price", km*2);
  
  //console.log(km);

  directionsService.route({
    origin: {lat: lat, lng: lon},  
    destination: {lat: latdes, lng: londes},  
    travelMode: google.maps.TravelMode[selectedMode]
  }, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

var todoBien = function(pos){
  lat = pos.coords.latitude;
  lon = pos.coords.longitude; 

  var latlon = new google.maps.LatLng(lat, lon);
  var latlon_car1 = new google.maps.LatLng(lat-0.009, lon-0.002);
  var latlon_car2 = new google.maps.LatLng(lat+0.008, lon+0.007);
  var latlon_car3 = new google.maps.LatLng(lat-0.002, lon+0.004);
  //$("#map").addClass("tamanoMapa");

  //configuracion de google
  var misOpciones = {
    center:latlon, zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    navigationControlOptions: {
      style: google.maps.NavigationControlStyle.SMALL
    }
  };

  var mapa = new google.maps.Map(document.getElementById("map"), misOpciones);

  var marcador = new google.maps.Marker({
    position: latlon,
    map: mapa,
    title: "You are here"
  });

  var marcador = new google.maps.Marker({
    position: latlon_car1,
    map: mapa,
    icon: 'http://www.rainmotorenworks.com/frontend/images/icon.png',
    title: "car 1"
  });

  var marcador = new google.maps.Marker({
    position: latlon_car2,
    map: mapa,
    icon: 'http://www.rainmotorenworks.com/frontend/images/icon.png',
    title: "car 2"
  });

  var marcador = new google.maps.Marker({
    position: latlon_car3,
    map: mapa,
    icon: 'http://www.rainmotorenworks.com/frontend/images/icon.png',
    title: "car 3"
  });


  if(flag == 1){

    ////////////////////////
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: {lat: lat, lng: lon}
    });
    directionsDisplay.setMap(map);
    
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  }
  flag = 1;
}

var hayError = function (error){
  swal("ERROR");
}

function generarDirec(geocoder, resultsMap) {
  var direccion = $("#dire").val();
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ "address": direccion} , dirResultado);
}

var dirResultado = function(resultado, estado){
  if (estado){
    var opMap = {
      center: resultado[0].geometry.location,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    var mapa = new google.maps.Map(document.getElementById("map"), opMap);
    mapa.fitBounds(resultado[0].geometry.viewport);
    londes = resultado[0].geometry.location.lng();
    latdes = resultado[0].geometry.location.lat();

    var markerOptions = { position: resultado[0].geometry.location }
        var marker = new google.maps.Marker(markerOptions);
        marker.setMap(mapa);
    
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(todoBien, hayError);
    }
  }

}


function show_contact(){
  $("#mitad").removeClass("ocultar");        
}

function delete_contact(){
  $("#mitad").addClass("ocultar");
}