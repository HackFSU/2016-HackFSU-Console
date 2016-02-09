/**
* Setup environment and launch
*/

'use strict';

import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
// import morgan from 'morgan';
import bunyan from 'bunyan';

import db from 'config/db';
import store from 'app/store';
import routes from 'app/routes';
import boot from 'app/boot';

export default function() {
	/**
	 * Settings
	 */

	// .env -> process.env
	dotenv.load();

	let app = express();

	// Development settings
	if(app.get('env') === 'development') {
		app.locals.pretty = true;
		// app.use(morgan('dev'));
		app.set('maxAge', 0);
	} else if (app.get('env') === 'production') {
		app.locals.pretty = false;
		app.set('maxAge', 86400000); 	// One day
	}
	app.locals.runLevel = app.get('env');

	app.set('port', process.env.PORT || 5003);

	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');

	// logging
	let log = bunyan.createLogger({ name: 'HackFSU' });

	// Log environment variables
	log.info({
		environment: dotenv.keys_and_values
	}, 'Custom Environment Values');
	app.set('logger', log);

	/**
	 * Data management
	 */

	// Give templates store access
	app.locals.store = store;


	/**
	 * Request Managment
	 * Each middlewhere is called in the order of the .use() calls
	 */

	// To be run on every request
	app.use(function(req, res, next) {
		// Handle caching
		const filesToCache = /(\.(img|font|mp4))+$/;
		if(req.url.match(filesToCache)) {
			res.setHeader('Cache-Control', 'public, max-age=' + app.get('maxAge'));
		}
		next();
	});

	// Serve unrestricted content
	app.use(express.static(path.join(__dirname, '../public/static')));
	app.use(express.static(path.join(__dirname, '../public/build')));
	app.use(express.static(path.join(__dirname, '../public/app')));

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


	// Serve routed content
	routes(app);

	// Start the server
	boot(app);

}
