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
import util from 'util';

// Logging
import morgan from 'morgan';

// Project utilities/core
import * as customLoader from '../lib/customLoader';
import * as helpers from '../app/helpers';
import store from '../lib/data';
import EmailManager from '../lib/EmailManager';
import { default as validate } from '../lib/validate';
import ACL from '../lib/acl';

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
	app.util = util;

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
		maxAge = 86400000; // 1day
	}

	e.set('port', process.env.PORT || 5003);
	e.set('views', app.dirs.app + '/views');
	e.set('view engine', 'jade');
	e.use(express.static(app.dirs.public, {
		maxAge: maxAge
	}));
	e.use(validator());
	app.io = io(server);

	// Handle caching
	e.use(function(req, res, next) {
		if(req.url.match(/(\.(img|font|mp4))+$/)) {
			res.setHeader('Cache-Control', 'public, max-age=' + maxAge);
		}
		next();
	});



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
	app.controller.admin = {};
	customLoader.loadAllExports(app, app.dirs.app + '/controllers');



	// Setup ACL
	app.acl= new ACL({
		roleNames: ['User', 'Hacker', 'Mentor', 'Admin', 'SuperAdmin'],
		getRoleIdFromRequest: function(req) {
			if(req.session.user) {
				return req.session.user.roleId;
			}
		},
		denyMiddleware: function(req, res) {
			res.redirect('/user/login?accessDenied=true');
		}
	});
	// acl.setEnforce(false);

	app.acl.mergeRoles('Hacker', ['User']);
	app.acl.mergeRoles('Mentor', ['User']);
	app.acl.mergeRoles('Admin', ['User', 'Hacker', 'Mentor']);
	app.acl.mergeRoles('SuperAdmin', ['User', 'Hacker', 'Mentor', 'Admin']);

	return app;
}
