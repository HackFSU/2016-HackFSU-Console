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

	req.checkBody('email').isEmail();
	req.checkBody('password').notEmpty();

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
	.then(function(userId) {
		User.fetchSimple(userId, 'roleId')
		.then(function(user) {

			// save ids in session data
			req.session = {
				userId: userId,
				roleId: user.roleId
			};

			req.log.info('[session] create', req.session);
			next();
		})
		.catch(function() {
			req.log.error('[session] missing roleId', userId);
			res.json({
				error: 'Server Error'
			});
		});
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
export function loadUserData(req, res, next) {
	User.fetchSimple(req.session.userId,
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
		next();
	})
	.catch(function(err) {
		req.log.error(err);
		res.json({
			error: err
		});
	});
}
