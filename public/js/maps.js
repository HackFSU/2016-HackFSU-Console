var geo = $('#geo');
var scroll = $('#contact').offset().top;
var lati = 30.445401;
var longi = -84.299761;
var gotPos = false;

$(window).on('scroll', function() {
	var ypos = window.pageYOffset;
	if(ypos > scroll && gotPos === false) {
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition, showError);
			gotPos = true;
		}else{
			geo.html("Geolocation is not supported by this browser.");
		}
	}
});

function showPosition(position) {
	var origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	var destination = new google.maps.LatLng(lati, longi);

	var directionsService = new google.maps.DirectionsService();
	var request = {
		origin: origin,
		destination: destination,
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	};

	directionsService.route(request, function(response, status) {
		if(status === 'OK') {
			var point = response.routes[0].legs[0];
			var str = point.duration.text.replace("mins", "minutes");
			geo.html("You could be here in just " + str + "!");
		}
	});
}
function showError(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			geo.html("User denied request for geolocation.");
			break;
		case error.POSITION_UNAVAILABLE:
			geo.html("Location information is unavailable.");
			break;
		case error.TIMEOUT:
			geo.html("The request to get user location timed out.");
			break;
		case error.UNKNOWN_ERROR:
			geo.html("An unknown error occurred.");
			break;
	}
}