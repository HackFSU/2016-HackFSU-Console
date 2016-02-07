/**
 * Middleware for /user/*
 */
'use strict';

import User from 'app/models/User';
import { acl } from 'app/routes/util';
import _ from 'lodash';

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
	User.checkLogin(req.body.email.toLowerCase(), req.body.password)
	.then(function(userId) {
		User.fetchSimple(userId, 'roleKey')
		.then(function(user) {
			// make sure at least counted as a user
			if(typeof user.roleKey === 'undefined') {
				req.log.error('[session] missing roleKey', userId);
				user.roleKey = userRoleId;
			}

			// save ids in session data, make sure it at least has user role
			req.session.user = {
				userId: userId,
				roleKey: acl.addKeys(user.roleKey, acl.role('User').id)
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
	.catch(function(err) {
		req.log.error('Error!', err);
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


export function redirectLoggedIn(req, res, next) {
	if(req.session.user &&
	res.locals.acl &&
	res.locals.acl.canAccess.User) {
		res.redirect('./profile' + (req.query.accessDenied ? '?accessDenied=true' : ''));
		return;
	}
	// Not a logged in with a valid user
	next();
}

export function validateSignup(req, res, next) {
	req.checkBody('email').isEmail();
	req.checkBody('password').notEmpty();
	req.checkBody('firstName').notEmpty();
	req.checkBody('lastName').notEmpty();
	req.checkBody('shirtSize').isShirtSize();
	req.checkBody('phone').notEmpty();

	req.sanitizeBody('phone').toPhoneString();

	if(req.validationErrors()) {
		res.json({
			error: req.validationErrors()
		});
		return;
	}

	next();
}

export function signupNewUser(req, res, next) {
	User.new({
		email: req.body.email.toLowerCase(),
		password: req.body.password,
		firstName: _.startCase(req.body.firstName),
		lastName: _.startCase(req.body.lastName),
		shirtSize: req.body.shirtSize,
		phone: req.body.phone
	}).save().then(function(obj) {
		res.locals.user = {
			objectId: obj.id
		};
		req.log.info('[user] New User saved', obj.id);
		next();
	}, function(err) {
		req.log.error('[/user/signup] Unable to create user with ' + req.body.email.toLowerCase(), err);
		res.status(500);
		res.json({
			error: err
		});
	});
}

export function checkEmailUsed(req, res, next) {
	User.checkEmailUsed(req.body.email)
	.then(function(inUse) {
		if(inUse){
			res.json({
				error: `Email "${req.body.email}" already in use.`,
				emailInUse:inUse
			});
		} else {
			next();
		}
	})
	.catch(function(err) {
		req.log.error('[/user/signup] Error checking for email ' + req.body.email, err);
		res.status(500);
		res.json({
			error: err
		});
	});
}


/**
 * Middleware creator to update a user key.
 * @param getUserId - function to return the userId of the user to update
 * @param roleName - the name of the role to add to the user
 */
export function addUserRole(getUserId, roleName) {
	let roleId = acl.role(roleName).id;

	return function(req, res, next) {
		let userId = getUserId(req, res);

		// Get the current rolekey
		User.fetchSimple(userId, ['roleKey'])
		.then(function(user) {
			let newKey = acl.addKeys(user.roleKey, roleId);
			user.__obj.set('roleKey', newKey);
			user.__obj.save()
			.then(function() {
				req.log.info(`[user] User ${userId} roleKey ${user.roleKey} => ${newKey}`);
				next();
			}, function(err) {
				throw new Error(err);
			});
		})
		.catch(function(err) {
			req.log.error('[user] Error updating user roleKey', err);
			res.status(500);
			res.json({
				error: err
			});
		});
	};
}
