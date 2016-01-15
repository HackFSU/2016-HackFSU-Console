/**
* Setup environment and launch
*/

'use strict';

import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import bunyan from 'bunyan';
import Parse from 'parse/node';
import store from 'app/store';
import routes from 'app/routes';
import * as acl from 'app/lib/acl';
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
		app.use(morgan('dev'));
		app.set('maxAge', 0);
	} else if (app.get('env') === 'production') {
		app.locals.pretty = false;
		app.set('maxAge', 86400000); 	// One day
	}

	app.set('port', process.env.PORT || 5003);

	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');

	// logging
	let log = bunyan.createLogger({ name: 'HackFSU' });
	log.info({
		environment: dotenv.keys_and_values
	}, 'Custom Environment Values');
	app.set('logger', log);

	/**
	 * Data management
	 */

	// Give templates store access
	app.locals.store = store;

	// Initialize db (Parse)
	Parse.initialize(
		process.env.PARSE_APP_ID,
		process.env.PARSE_JS_KEY,
		process.env.PARSE_MASTER_KEY
	);
	Parse.Cloud.useMasterKey();

	// TODO: MySQL db

	/**
	 * Setup ACL
	 * TODO: get role names/ids from db
	 */
	acl.initialize(
		store.roles,
		function(req) {
			if(req.session && req.session.roleKey) {
				return req.session.roleKey;
			}
		},
		function(req, res) {
			res.redirect('/user/login?accessDenied=true');
		}
	);

	acl.role('Hacker').canAccess('User');
	acl.role('Mentor').canAccess('User');
	acl.role('Admin').canAccess(['User', 'Hacker', 'Mentor']);
	acl.role('Super Admin').canAccess('Admin', true);


	/**
	 * Request Managment
	 * Each middlewhere is called in the order of the .use() calls
	 */

	// To be run on every request
	app.use(function(req, res, next) {
		// Handle caching
		if(req.url.match(/(\.(img|font|mp4))+$/)) {
			res.setHeader('Cache-Control', 'public, max-age=' + app.get('maxAge'));
		}
		next();
	});

	// Serve unrestricted content
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.static(path.join(__dirname, 'public/app')));


	// Prepare request for route managment
	app.use(function(req, res, next) {
		// Allow middleware to use the log
		req.log = log;
		next();
	});


	// Serve routed content
	routes(app);
	
	// Start the server
	boot(app);
}

