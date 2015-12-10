/**
 * Waits for user to scroll to #travel div then asks for browser geolocation permission.
 * Uses G Maps API to get/show travel time
 */

/* global google */

(function($) {
	'use strict';

	var geo = $('#geo');
	var scroll = $('#travel').offset().top;
	var lati = 30.445401;
	var longi = -84.299761;
	var gotPos = false;

	window.initMap = function() {
		var showError = function(error) {
			switch(error.code) {
				case error.PERMISSION_DENIED:
					$('.geo-info').html('Oh no! You denied the location request.');
					break;
				case error.POSITION_UNAVAILABLE:
					$('.geo-info').html('Your current location is unavailable.');
					break;
				case error.TIMEOUT:
					$('.geo-info').html('The location request timed out.');
					break;
				case error.UNKNOWN_ERROR:
					$('.geo-info').html('An unknown error occurred.');
					break;
			}
		};

		$(window).on('scroll', function() {
			var ypos = window.pageYOffset;
			if(ypos > scroll && gotPos === false) {
				if(navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(showPosition, showError);
					gotPos = true;
				} else {
					$('.geo-info').html('Geolocation is not supported by this browser.');
				}
			}
		});

		var fromSeconds = function(seconds) {
			var hours = Math.floor(seconds / 3600);
			seconds = seconds - hours * 3600;
			var minutes = (Math.floor(seconds / 60) < 10) ? Math.floor(seconds / 60) : Math.floor(seconds / 60);
			
			return {
				hours: hours,
				minutes: minutes
			};
		};

		var showPosition = function(position) {
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
					var time = fromSeconds(point.duration.value);
					$('#geoHrs').html(time.hours);
					$('#geoMins').html(time.minutes);
				}
			});
		};
	
	};

})(jQuery);