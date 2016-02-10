/**
* config/app.js
*
* App-wide configuration for the Express app server.
*
* EXPORTS:
* 	default (object):
* 		Express app instance with configured settings.
*/

'use strict';

import express from 'express';
import bunyan from 'bunyan';
import path from 'path';

import store from 'app/store';
import log from 'config/log.js';


// Express instance that we will export
const app = express();

// Development settings
if (app.get('env') === 'development') {
	app.locals.pretty = true;
	// app.use(morgan('dev'));
	app.set('cacheMaxAge', 0);
}
// Production settings
else if (app.get('env') === 'production') {
	app.locals.pretty = false;
	app.set('cacheMaxAge', 86400000); 	// One day
}

app.locals.runLevel = app.get('env');

// On the real, how did we come up with port 5003? Too late to change it now
// though since it's in my Chrome history tho.
app.set('port', process.env.PORT || 5003);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


/**
* Data management
*/

// Give templates store access
app.locals.store = store;


/**
* Request Managment
*/

// To be run on every request
app.use(function(req, res, next) {
	// Regex defining what file types to cache
	const filesToCache = /(\.(img|font|mp4))+$/;

	// Cache files we define to be cahcned
	if (req.url.match(filesToCache)) {
		res.setHeader('Cache-Control', 'public, max-age=' + app.get('cachMaxAge'));
	}

	next();
});

// Serve static content
// static: Files that won't change and don't need to be built (like images,
// documents, etc).
// build: Files that have been built through a build system (like SASS files,
// ES6 JavaScripts, etc).
app.use(express.static(path.join(__dirname, '../public/static')));
app.use(express.static(path.join(__dirname, '../public/build')));

// Prepare request for route managment
app.use(function(req, res, next) {
	// Allow middleware to use the log
	req.log = log;

	// Allow Socket.io to be used by any route
	req.io = app.io;

	// Allow jade to see bare baseUrl for nav
	res.locals.urlPath = req.originalUrl.replace(/(\?.*)|(#.*)/g, '');

	next();
});

export default app;
