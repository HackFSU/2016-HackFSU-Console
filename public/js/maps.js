var geo = $('#geo');
if(navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(showPosition, showError);
}else{
	geo.html("Geolocation is not supported by this browser.");
}
function showPosition(position) {
	var origin = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	var destination = new google.maps.LatLng('30.445401', '-84.299761');

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
			geo.html("You could be here in just " + str);
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