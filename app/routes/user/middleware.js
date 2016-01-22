/**
 * Middleware for /user/*
 */
'use strict';

import User from 'app/models/User';

/**
 * Builds user session for valid users
 */
export function validateLogin(req, res, next) {
	// TODO: build req.session.user object

	req.checkBody('email', 'Invalid params').isEmail();
	req.checkBody('password', 'Invalid params').notEmpty();

	if(req.validationErrors()) {
		res.json({
			error: req.validationErrors()
		});
		return;
	}

	next();
}

export function loginUser(req, res, next) {
	User.checkLogin(req.body.email, req.body.password)
	.then(function(user) {
		req.session = {
			user: user.objectId,
			roleKey: user.roleKey
		};

		next();
	})
	.catch(function() {
		res.json({
			error: 'Invalid Credentials'
		});
	});
}

/**
 * Pulls user's session data
 */
export function loadUser(req, res, next) {
	User.loadSimple(req.session.user,
		'firstName',
		'lastName',
		'github',
		'phone',
		'diet',
		'shirtSize',
		'email'
	)
	.then(function(user) {
		res.locals.user = user;
	})
	.catch(function(err) {
		req.log.error(err);
		res.json({
			error: err
		});
	});
}
