/**
* Route mount points
*/

'use strict';

import home from './home';
import register from './register';
import mentor from './mentor';
import help from './help';
//import dashboard from './dashboard';
//import api from './api';

export default function(app) {
	// Mount paths
	app.use('/', home);
	app.use('/register', register);
	app.use('/mentor', mentor);
	app.use('/help', help);

	// Kill the API for now
	//app.use('/api', api);
	//app.use('dashboard', dashboard);

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// error handlers

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
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

		if (err.status === 404) {
			err.message = '404 IT\'S A TRAP';
			err.starwars = true;
		}

		res.render('error', {
			message: err.message,
			starwars: err.starwars,
			error: {}
		});
	});
}
