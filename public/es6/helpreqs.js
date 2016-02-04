/**
 * Help requests.
 */

(function($) {
	'use strict';

	var socket = io.connect('http://localhost:5003');
	socket.on('news', function (data) {
		console.log(data);
		socket.emit('another event', { my: 'data' });
	});

	$('#helpreqs').DataTable({
		paging: false
	});

})(jQuery);
