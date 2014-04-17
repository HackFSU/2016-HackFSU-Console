// Instantiate express
var express = require('express');
var app = express();

// Set up routes. All subfolders of routes must be included and include an 
// index.js file specifying the exports
var routes = require('./routes');
var data = require('./routes/data');
var updates = require('./routes/updates');

// Set up views/templating engine
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Allow files in public/ to be accessed directly
app.use(express.static(__dirname + '/public'));


app.get('/', routes.index);
app.get('/data', data.index);
app.get('/updates', updates.index);


// Boot up server
var port = Number(process.env.PORT || 5000);
var server = app.listen(port, function() {
	console.log('Listening on port ' + port);
});