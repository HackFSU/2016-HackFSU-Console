/**
 * Definition of the project-wide 'app'
 */

'use strict';

// Express Core
import http from 'http';
import express from 'express';
import validator from 'express-validator';
import session from 'express-session';
import io from 'socket.io';
import Parse from 'parse/node';

// Utility
import Q from 'q';
import moment from 'moment';
import uuid from 'node-uuid';
import _ from 'lodash';
import path from 'path';

// Logging
import morgan from 'morgan';

// Project utilities/core
import * as customLoader from '../lib/customLoader';
import * as helpers from '../app/helpers';
import store from '../lib/data';
import EmailManager from '../lib/EmailManager';
import { default as validate } from '../lib/validate';

export default function configureApp() {
	const app = {};
	let maxAge;

	// Save utility references
	app.Q = Q;
	app.moment = moment;
	app.uuid = uuid;
	app._ = _;
	app.validate = validate;
	app.path = path;

	app.dirs = {
		public: path.resolve(__dirname + '/../public'),
		app: path.resolve(__dirname + '/../app'),
		lib: path.resolve(__dirname + '/../lib')
	};


	// Configure Express core
	const e = app.e = express();
	const server = app.server = http.createServer(e);

	// Handle run level settings
	if(process.env.RUN_LEVEL === 'DEV') {
		e.locals.pretty = true;
		e.use(morgan('dev'));
		maxAge = 0;
	} else if(process.env.RUN_LEVEL === 'PROD') {
		e.locals.pretty = false;
		maxAge = 3600000;
	}

	e.set('port', process.env.PORT || 5003);
	e.set('views', app.dirs.app + '/views');
	e.set('view engine', 'jade');
	e.use(express.static(app.dirs.public, {
		maxAge: 3600000 // 1hr
	}));
	e.use(validator());
	app.io = io(server);

	

	// Setup session
	e.use(session({
		name: 'connect.sid',
		secret: process.env.SECRET + 'missingSecret',
		cookie: {
			maxAge: 172800000		// 2 days
		},
		saveUninitialized: false,
		resave: false
	}));
	

	// Pass locals to jade
	e.use(function(req, res, next) {
		res.locals.session = req.session;
		res.locals.store = app.store;
		next();
	});

	// Initialize db (Parse)
	app.Parse = Parse;
	Parse.initialize(
		process.env.PARSE_APP_ID,
		process.env.PARSE_JS_KEY,
		process.env.PARSE_MASTER_KEY
	);
	Parse.Cloud.useMasterKey();

	// Load project files
	app.store = store;
	app.email = new EmailManager(
		store.email.FROM_EMAIL_INFO,
		store.email.FROM_NAME
	);

	e.locals.helpers = helpers;

	app.model = {}; // Should all be classes
	customLoader.loadAllExports(app, app.dirs.app + '/models');

	app.controller = {}; // Should all be functions
	customLoader.loadAllExports(app, app.dirs.app + '/controllers');



	return app;
}
