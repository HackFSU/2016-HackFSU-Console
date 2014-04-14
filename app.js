// Instantiate express
var express = require('express');
var app = express();


// Boot up server
var server = app.lister(3000. function() {
	console.log('Listening on port %d', server.address().port);
});