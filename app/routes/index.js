/**
* Route mount points
*/

'use strict';

import home from 'app/routes/home';
import register from 'app/routes/register';
import mentor from 'app/routes/mentor';
import user from 'app/routes/user';
import help from 'app/routes/help';
import { session } from 'app/routes/util';


export default function(app) {

	/**
	 * Mount paths
	 */

	// general, public paths
	app.use('/', home);
	app.use('/register', register);

	// session related paths
	app.use(session);
	app.use('/user', user);
	app.use('/mentor', mentor);
	app.use('/help', help);

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
