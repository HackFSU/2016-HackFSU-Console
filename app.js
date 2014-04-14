// Instantiate express
var express = require('express');
var app = express();

// Allow files in public/ to be accessed directly
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.send("It's working...");
});


// Boot up server
var server = app.listen(3000. function() {
	console.log('Listening on port %d', server.address().port);
});