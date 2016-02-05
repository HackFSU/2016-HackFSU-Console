/**
* Route mount points
*/

'use strict';

import bodyParser from 'body-parser';
import session from 'express-session';

import { validator } from 'app/routes/util';

import home from 'app/routes/home';
import register from 'app/routes/register';
import mentor from 'app/routes/mentor';
import user from 'app/routes/user';
import help from 'app/routes/help';
import admin from 'app/routes/admin';
import confirm from 'app/routes/confirm';
import judge from 'app/routes/judge';
import checkin from 'app/routes/checkin';

export default function(app) {

	// parse body for post reqs only
	app.post('*',
		bodyParser.urlencoded({
			limit: '2mb',
			extended: false
		}),
		bodyParser.json(),
		validator
	);

	app.use(session({
		secret: process.env.secret || 'BoopTheSnoot123',
		cookie: {
			maxAge: 172800000,
			secure: false	// TODO: setup HTTPS for this
		},
		resave: false,
		saveUninitialized: false
	}));

	/**
	 * Mount paths
	 */
	app.use('/', home);
	app.use('/register', register);
	app.use('/mentor', mentor);
	app.use('/help', help);
	app.use('/user', user);
	app.use('/admin', admin);
	app.use('/confirm', confirm);
	app.use('/judge', judge);
	app.use('/checkin', checkin);

	/**
	 * Random pages/shortcuts
	 */
	app.get('/no', function(req, res) {
		res.render('index/no', {
			notReady: !!req.query.notReady
		});
	});

	app.get('/login', function(req, res) {
		res.redirect('/user/login');
	});

	app.get('/signup', function(req, res) {
		res.redirect('/user/signup');
	});


	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// error handlers

	// development error handler
	// will print stacktrace
	if(app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			req.log.error(`[leaked @ ${req.originalUrl}]`, err, err.stack);
			res.render('error', {
				message: err.message,
				error: err
			});
		});
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);

		if(err.status === 404) {
			err.message = '404 IT\'S A TRAP';
			err.starwars = true;
		} else {
			req.log.error('[leaked]', err, err.stack);
		}

		res.render('error', {
			message: err.message,
			starwars: err.starwars,
			error: {}
		});
	});
}
