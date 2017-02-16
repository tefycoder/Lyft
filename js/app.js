var cargaPag = function(){
	$("#numeros").keydown(validar);
	$("#numeros").keyup(comprobar);
	$("#celu").text(localStorage.getItem("celular")); 
	$("#sgt2").click(compararCodigo);
	$("#dig1").focus();
	$(".cnum").keyup(saltaFocus);
	$("#sgt3").click(valDatos);
	var esRuta = location.href.indexOf("map.html");
	if (esRuta > 0){
		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(todoBien, hayError);
		}
	}
	$("#contacto").click(aparecePerfil);
	$("#mitad").click(apareceMap);
	$(".nombreUs").text(localStorage.getItem("nombre") +" "+localStorage.getItem("apellido"));
	$("#resend").click(generarCod);
	$("#pick").click(generarDirec);
	$("#dire").dblclick(limparInput);
	$("#inputFile").change(cambiarFoto);
	var fotoPerfil = localStorage.getItem("guarFoto");
	var nombre = localStorage.getItem("nombre");
	var apellido = localStorage.getItem("apellido");
	var correo = localStorage.getItem("email");
	if (fotoPerfil != null) {
		$("#fotoGuar").attr("src", fotoPerfil);
		$("#fotoprev").attr("src", fotoPerfil);
		$("#semiFoto").attr("src", fotoPerfil);
	}
	if (nombre != null && apellido != null && correo != null) {
		$("#name").val(nombre);
		$("#lastname").val(apellido);
		$("#email").val(correo);
	}
}
var entra = true;
var conta = 0; 
$(document).ready(cargaPag);

var validar = function(e){
	var tecla = e.keyCode;
	if((tecla >= 48 && tecla <= 57) || tecla == 8){
		return true;
	}
	else 
		return false;
}
var comprobar = function(e){
	var caracteres = $(e.target).val().length;
	var tecla = e.keyCode;
	if (caracteres == 9){
		$("#sgt1").attr("href", "verify.html");
		$("#sgt1").click(generarCod);
	}
	else{
		$("#sgt1").removeAttr("href");
		$("#sgt1").unbind("click");
	}
}
var generarCod = function(){
	if(entra){
		var codigo = "LAB";
		for (var i = 0; i < 3; i++) {
			var nums = Math.round(Math.random()*9);
			codigo += nums;
		}

		alert(codigo);

		localStorage.setItem("guardarCod", codigo);

		var obtNum = $("#numeros").val();
		localStorage.setItem("celular", obtNum);

		var rutaVeri = local.href.indexOf("verify.html");
		if (rutaVeri < 0) {
			entra = false;
		}
	}
}
var compararCodigo = function(){
	var obtenCod = localStorage.getItem("guardarCod");

	var iniciales = "LAB";
	var pridig = $("#dig1").val();
	var segdig = $("#dig2").val();
	var terdig = $("#dig3").val();
	var juntar = pridig + segdig + terdig;
	var codigoRec = iniciales + juntar;

	if(pridig.length == 0 || segdig.length == 0 || terdig.length == 0){
		swal("Enter your code");
	}
	else if(obtenCod == codigoRec){
		$("#sgt2").attr("href","datos.html");
	}
	else
		swal("Invalid code");
}
var saltaFocus = function(e){
	if($(e.target).val().trim().length == 1){
		$(e.target).parent().next().children().focus();
	}
	if (e.keyCode == 8) {
		$(e.target).parent().prev().children().focus();
	}
}
var valDatos = function(){
	var cumple = true;
	if($("#nomb").val().trim().length == 0 || $("#apell").val().trim().length == 0 || $("#email").val().trim().length == 0) {
	 	alert("Complete all fields");
	 	cumple = false;
	}
	if(($("#nomb").val().trim().length < 3 || $("#nomb").val().trim().length > 21) || ($("#apell").val().trim().length < 3 || $("#apell").val().trim().length > 21)){
		alert("Invalid number of characters in name or lastname");
		cumple = false;
	}
	if(($("#email").val().trim().length < 6 || $("#email").val().trim().length > 51)){
		alert("Invalid number of characters in email");
		cumple = false;
	}
	var regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
	if (!regexEmail.test($("#email").val())){
		alert("Enter a valid email");
		cumple = false;
	}
	if ($("#checkbox").is(":checked") == false){
		alert("Accept terms and conditions");
		cumple = false;
	}
	if (cumple){
		var obtNomb = $("#nomb").val();
		localStorage.setItem("nombre",obtNomb);

		var obtApel = $("#apell").val();
		localStorage.setItem("apellido",obtApel);

		var obtEmail = $("#email").val();
		localStorage.setItem("email", obtEmail);

		$("#sgt3").attr("href", "map.html");
	}
}
var todoBien = function(pos){
	var lat = pos.coords.latitude;
	var lon = pos.coords.longitude; 
	var latlon = new google.maps.LatLng(lat, lon);
	$("#map").addClass("tamanoMapa");

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

	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({"latLng":latlon},direcActual);
}
var direcActual = function(resultado, estado){
	if (estado == google.maps.GeocoderStatus.OK){
		if (resultado[0]){
			$("#dire").val(resultado[0].formatted_address);
		}
	}
}
var hayError = function (error){
	swal("ERROR");
}
var aparecePerfil = function(){
	$("#mitad").removeClass("ocultar");
}
var apareceMap = function(){
	$("#mitad").addClass("ocultar");
}
var generarDirec = function(){
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

		var markerOptions = { position: resultado[0].geometry.location }
        var marker = new google.maps.Marker(markerOptions);
        marker.setMap(mapa);
	}
}
var limparInput = function(){
	$("#dire").val("");
}
var cambiarFoto = function(e){
	if(e.target.files && e.target.files[0]){
		var reader = new FileReader();

		reader.onload = function(e){
			var guardarFoto = e.target.result;
			$("#fotoprev").attr("src", guardarFoto);
			localStorage.setItem("guarFoto", guardarFoto);
		}
		reader.readAsDataURL(e.target.files[0]);

	}
}
