/**
* Setup environment and launch
*
* TODO: Refactor some of this code into a configuration file?
*/

'use strict';

import express from 'express';
import path from 'path';
import morgan from 'morgan';
import bunyan from 'bunyan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import dotenv from 'dotenv';
import store from 'common/store';
import Parse from 'parse/node';
import parseSession from 'common/parse-session';

// Load routes
import setRoutes from './routes';

// Load up the environment!
dotenv.load();

let app = express();
let log = bunyan.createLogger({ name: 'HackFSU' });

// Development settings
if(app.get('env') === 'development') {
	app.locals.pretty = true;
	app.use(morgan('dev'));
	app.set('maxAge', 0);
} else if (app.get('env') === 'production') {
	app.set('maxAge', 86400000); 	// One day
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Give templates store access
app.locals.store = store;

// Initialize db (Parse)
Parse.initialize(
	process.env.PARSE_APP_ID,
	process.env.PARSE_JS_KEY,
	process.env.PARSE_MASTER_KEY
);
Parse.Cloud.useMasterKey();




/**
 * Request Managment
 * Each middlewhere is called in the order of the .use() calls
 */

// Handle caching
app.use(function(req, res, next) {
	if(req.url.match(/(\.(img|font|mp4))+$/)) {
		res.setHeader('Cache-Control', 'public, max-age=' + app.get('maxAge'));
	}
	next();
});

// Serve unrestricted content
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/app')));


// Allow middleware to use the log
app.use(function(req, res, next) {
	req.log = log;
	next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	limit: '2mb',
	extended: false
}));
app.use(expressValidator());
app.use(cookieParser());

// Read session information
app.use(parseSession(function(req) {
	return req.param('sid');
}));


// Mount our routes. These are defined in /routes/index.js
setRoutes(app);

// logging
log.info({ environment: dotenv.keys_and_values }, 'Custom Environment Values');

export default app;
