// Instantiate express
var express = require('express');
var app = express();

// Set up views/templating engine
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Allow files in public/ to be accessed directly
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
	res.render('index', {
		title: 'HackFSU Console'
	});
});


// Boot up server
var port = Number(process.env.PORT || 5000);
var server = app.listen(port, function() {
	console.log('Listening on port ' + port);
});