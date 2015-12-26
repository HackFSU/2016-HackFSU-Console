/**
 * Setup environment and launch
 */

'use strict';

import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import bunyan from 'bunyan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import dotenv from 'dotenv';
import store from './app/store';
import Parse from 'parse/node';

// Load routes
import setRoutes from './routes';

// Load up the environment!
dotenv.load();

let app = express();
let log = bunyan.createLogger({ name: 'HackFSU' });

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

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Allow middleware to use the log
app.use(function(req, res, next) {
	req.log = log;
	next();
});
// HTTP request logging
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	limit: '2mb',
	extended: false
}));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/app')));

// Mount our routes. These are defined in /routes/index.js
setRoutes(app);

export default app;
