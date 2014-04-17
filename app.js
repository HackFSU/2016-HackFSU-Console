// Instantiate express
var express = require('express');
var app = express();

// Module dependencies
var Kaiseki = require('kaiseki');

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

// Parse API Keys
app.locals.APP_ID = "4NDzxeC8KxdZi4Kyok7QfGhtS27GuHfntNh9ZSfL";
app.locals.MASTER_KEY = "k5K40usqxTLInr0OkDpyanoFO6ChaDkQsZTfCwRu";
app.locals.REST_KEY = "Yv6wS2RcB2iYqs3Fn7kNpGsjSSquY0Xj50uKQxbFar";

// Set up kaiseki
var kaiseki = new Kaiseki(app.locals.APP_ID, app.locals.REST_KEY);
kaiseki.masterKey = app.locals.MASTER_KEY;


// Set up routes
app.get('/', routes.index);
app.get('/data', data.index(kaiseki));
app.get('/updates', updates.index(kaiseki));


// Boot up server
var port = Number(process.env.PORT || 5000);
var server = app.listen(port, function() {
	console.log('Listening on port ' + port);
});