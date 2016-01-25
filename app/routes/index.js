/**
* Route mount points
*/

'use strict';

import home from 'app/routes/home';
import register from 'app/routes/register';
import mentor from 'app/routes/mentor';
import user from 'app/routes/user';
import help from 'app/routes/help';
import api from 'app/routes/api';
import { session, parser, validator } from 'app/routes/util';


export default function(app) {
	/**
	* HTTP Body Parsers
	*/
	app.use(parser.urlencoded);
	app.use(validator);

	/**
	 * Mount paths
	 */

	// general, public paths
	// @jrdbnntt Put these here for now because none of these have "sessions" as of
	// yet. For example, /mentor is the mentor signup and /help is to submit help
	// requests BUT we aren't using login for said help reqs (in case people forgot)
	// passwords and the like.
	app.use('/', home);
	app.use('/register', register);
	app.use('/mentor', mentor);
	app.use('/help', help);
	//app.use('/api', api);					// Only use this for dev purposes

	// session related paths
	app.use(session);
	app.use('/user', user);

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
