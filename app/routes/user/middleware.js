/**
 * Middleware for /user/*
 */
'use strict';

import User from 'app/models/User';
import { acl } from 'app/routes/util';

const userRoleId = acl.role('User').id;

/**
 * Builds user session for valid users
 */
export function validateLogin(req, res, next) {
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
		User.fetchSimple(userId, 'roleKey')
		.then(function(user) {
			// make sure at least counted as a user
			if(typeof user.roleKey === 'undefined') {
				req.log.error('[session] missing roleKey', userId);
				user.roleKey = userRoleId;
			}

			// save ids in session data
			req.session.user = {
				userId: userId,
				roleKey: user.roleKey
			};

			req.log.info(`[session] login ${userId} : ${user.roleKey}`);
			next();
		})
		.catch(function(err) {
			req.log.error('[session] Problem logging in', userId, err);
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
	User.fetchSimple(req.session.user.userId,
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
